import { Message, ClientUser, TextChannel } from "discord.js";
import { LambertDiscordClient } from "./LambertDiscordClient";
import { Argument, ArgumentOptions } from "./Argument";
import { Handler } from "./Handler";
import { LambertMessage } from "./LambertExtended";
import { LambertPermissionResolvable } from "./LambertPermission";
import { ApplicationCommand, ApplicationCommandOptionChoice } from "./ApplicationCommand";
import { ApplicationCommandInteractionDataOption, CommandInteraction, CommandTrigger } from "./CommandInteraction";
import { ERRORS, LambertError } from "./LambertError";
import { LambertGuildMember } from "./LambertGuildMember";

export type ThrottlingOptions = {
	usages: number;
	duration: number;
};

export type CommandExecOptions = {
	msg: LambertMessage;
	lang: any; // TODO: Language
};

export type _Throttle = {
	start: number;
	usages: number;
	timeout?: NodeJS.Timeout;
};

export type CommandOptions = {
	id: string;
	handler: Handler<Command>;
	category?: string;
	client?: LambertDiscordClient;
	autoAcknowledge?: boolean;
	aliases?: string[];
	description?: string;
	details?: string;
	guarded?: boolean;
	guildOnly?: boolean;
	hidden?: boolean;
	nsfw?: boolean;
	throttling?: ThrottlingOptions;
	globalThrottling?: ThrottlingOptions;
	clientPermissions?: LambertPermissionResolvable;
	userPermissions?: LambertPermissionResolvable;
	args?: ArgumentOptions[];
};

const ARGSSPLIT = /("(.+)")|([^\n\s]+)/g;

export abstract class Command extends Handler<Command> {
	// command.modules are subcommands
	public slashId: string;
	public args: Argument[];
	public aliases: string[] = [];
	public categoryId: string = "";
	public category: Command[];
	public autoAcknowledge: boolean;
	public client: LambertDiscordClient;
	public description: string = "";
	public details: string = "";
	public guarded: boolean = false;
	public guildOnly: boolean = false;
	public hidden: boolean = false;
	public nsfw: boolean = false;
	public throttling: ThrottlingOptions;
	public globalThrottling: ThrottlingOptions;
	public readonly _throttles: Map<string, _Throttle> = new Map();
	public _globalThrottle?: _Throttle = { start: Date.now(), usages: 0, timeout: undefined };
	public clientPermissions: LambertPermissionResolvable = [];
	public userPermissions: LambertPermissionResolvable = [];

	constructor(props: CommandOptions) {
		super({ id: props.id });
		this.client = props.client || props.handler.client;
		this.description = props.description || "";
		this.details = props.details || "";
		this.categoryId = props.category || "default";
		this.guarded = props.guarded || false;
		this.guildOnly = props.guildOnly || false;
		this.hidden = props.hidden || false;
		this.nsfw = props.nsfw || false;
		this.throttling = props.throttling;
		this.autoAcknowledge = props.autoAcknowledge ?? true;
		this.globalThrottling = props.globalThrottling;
		this.clientPermissions = props.clientPermissions || [];
		this.userPermissions = props.userPermissions || [];
		this.args = (props.args || []).map((x) => new Argument(this, x));
		this.aliases = (props.aliases || []).map((x) => x.toLowerCase());

		if (this.id.includes("-")) this.aliases.push(this.id.replaceAll("-", ""));
		for (const alias of this.aliases) {
			if (alias.includes("-")) this.aliases.push(alias.replaceAll("-", ""));
		}
	}

	public _exec(trigger: CommandTrigger, args: any): Promise<any> | any {
		for (const key in args) {
			const val = args[key];
			if (!val) continue;
			const arg = this.args.find((x) => x.id === key);
			if (!arg) continue;
			if (arg.type.id === "subcommmand") {
				return val.subcommand._exec(trigger, val.subargs);
			}
		}
	}

	public exec(trigger: CommandTrigger, args: any): Promise<any> | any {
		throw new Error("Please make a exec() method in command " + this.id);
	}

	throttle(userID: string): number {
		// TODO: if owner, always return false

		const time = (start: number, duration: number) => {
			let t = ((Date.now() - start - 100 * 1000) / 1000) * -1;
			return t < 0 ? 0 : t;
		};

		if (this.globalThrottling) {
			let throttle = this._globalThrottle;
			if (!throttle) {
				throttle = {
					start: Date.now(),
					usages: 0,
					timeout: this.client.setTimeout(() => {
						this._globalThrottle = undefined;
					}, this.globalThrottling.duration * 1000),
				};
			}

			if (throttle.usages++ > this.globalThrottling.usages)
				return time(throttle.start, this.globalThrottling.duration);
		}

		if (this.throttling) {
			let throttle = this._throttles.get(userID);
			if (!throttle) {
				throttle = {
					start: Date.now(),
					usages: 0,
					timeout: this.client.setTimeout(() => {
						this._throttles.delete(userID);
					}, this.throttling.duration * 1000),
				};
				this._throttles.set(userID, throttle);
			}

			if (throttle.usages++ > this.throttling.usages) return time(throttle.start, this.throttling.duration);
		}

		return 0;
	}

	getModule(id: string): Command | undefined {
		id = id.toLowerCase();
		if (this.id === id) return this;
		if (this.aliases.includes(id)) return this;
	}

	async check(trigger: CommandTrigger) {
		const throttleTime = this.throttle((<Message>trigger).author?.id || trigger.member?.id);
		if (throttleTime) {
			throw new LambertError(ERRORS.THROTTLED, { user: trigger, time: throttleTime });
		}

		const botMember = <LambertGuildMember | null>trigger.guild?.members.resolve((<ClientUser>this.client.user).id);
		if (botMember) await botMember.hasAuths(this.clientPermissions, true);
		if (trigger.member) await trigger.member.hasAuths(this.userPermissions, true);

		if ((<TextChannel>trigger.channel).nsfw && !this.nsfw)
			throw new LambertError(ERRORS.NOT_A_NSFW_CHANNEL, { command: this, trigger, channel: trigger.channel });

		if (!trigger.guild && this.guildOnly) throw new LambertError(ERRORS.GUILD_ONLY, { command: this, trigger });
	}

	async getArgs({ trigger, args }: { trigger: CommandTrigger; args: Record<string, Argument> | string }) {
		let parsedArgs: Record<string, any> = {};
		if (trigger instanceof Message) {
			args = <string>args;
			let parts = args.match(ARGSSPLIT);

			const wait = parts
				.map((arg, index) => {
					if (index == this.args.length - 1) return parts.slice(index).map(trim).join(" ");
					return parts[index];
				})
				.map(async (x, index) => {
					let arg = this.args[index];
					parsedArgs[arg.id] = await arg.type.parse({ val: trim(x), trigger, cmd: this });
				});

			await Promise.all(wait);
		} else if (trigger instanceof CommandInteraction) {
			parsedArgs = await trigger.getArgs();
		} else throw new Error("Unkown Command Trigger");

		for (const arg of this.args) {
			const val = parsedArgs[arg.id];

			if (arg.required && val == null)
				throw new LambertError(ERRORS.ARGUMENT_REQUIRED, { argument: arg, cmd: this, trigger });
			if (arg.default && val == null) parsedArgs[arg.id] = arg.default;
			if (arg.max && val > arg.max)
				throw new LambertError(ERRORS.ARGUMENT_TOO_BIG, { argument: arg, cmd: this, trigger });
			if (arg.min && val > arg.min)
				throw new LambertError(ERRORS.ARGUMENT_TOO_SMALL, { argument: arg, cmd: this, trigger });
		}

		return parsedArgs;
	}

	toSlashCommand(): ApplicationCommand {
		const options = this.args.map((x) => {
			let choices: ApplicationCommandOptionChoice[] = [];

			if (x.type.id === "union") choices = x.default.map((x: string | number) => ({ name: x, value: typeof x }));

			return {
				type: x.type.slashType,
				name: x.id,
				description: x.description,
				required: x.required,
				choices,
				// options: [], if arg is sub command -> parameter
			};
		});

		return {
			name: this.id,
			description: this.description,
			options,
		};
	}
}

function trim(x: string) {
	if (x.startsWith('"') && x.endsWith('"')) return x.slice(1, x.length - 2).trim();
	return x.trim();
}
