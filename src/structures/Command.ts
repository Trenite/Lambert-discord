import { LambertDiscordClient } from "../client/LambertDiscordClient";
import { Argument, ArgumentOptions } from "./Argument";
import { Handler } from "./Handler";
import { LambertMessage } from "./LambertExtended";
import { LambertPermissionResolvable } from "./LambertPermission";

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
	aliases: string[];
	description: string;
	details: string;
	guarded: boolean;
	guildOnly: boolean;
	hidden: boolean;
	nsfw: boolean;
	throttling: ThrottlingOptions;
	globalThrottling: ThrottlingOptions;
	clientPermissions: LambertPermissionResolvable;
	userPermissions: LambertPermissionResolvable;
	args: ArgumentOptions[];
};

export abstract class Command extends Handler<Command> {
	// command.modules are subcommands
	public client: LambertDiscordClient;
	public aliases: string[] = [];
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
	public args: Argument[];

	constructor(props: CommandOptions) {
		super(props.id);
		this.aliases = props.aliases;
		this.description = props.description;
		this.details = props.details;
		this.guarded = props.guarded;
		this.guildOnly = props.guildOnly;
		this.hidden = props.hidden;
		this.nsfw = props.nsfw;
		this.throttling = props.throttling;
		this.globalThrottling = props.globalThrottling;
		this.clientPermissions = props.clientPermissions;
		this.userPermissions = props.userPermissions;
		this.args = props.args.map((x) => new Argument(x));
	}

	public exec(): Promise<any> | any {
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
		if (this.id.toLowerCase() === id.toLowerCase()) return this;
		if (this.aliases.includes(id.toLowerCase())) return this;
	}
}
