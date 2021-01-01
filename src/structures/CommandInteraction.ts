import { ERANGE } from "constants";
import {
	Base,
	GuildMember,
	TextChannel,
	Guild,
	StringResolvable,
	MessageOptions,
	APIMessage,
	Message,
} from "discord.js";
import { Argument } from "./Argument";
import { Command } from "./Command";
import { LambertDiscordClient } from "./LambertDiscordClient";
import { transformSend } from "./LambertTextBasedChannel";
import { removeNull } from "./MessageTransformers";

export type CommandTrigger = Message | CommandInteraction;

export interface Interaction {
	id: string;
	type: InteractionType;
	guild_id: string;
	channel_id: string;
	member: GuildMember;
	token: string;
	version: number;
	data: ApplicationCommandInteractionData;
}

export type InteractionType = 1 | 2;

export interface ApplicationCommandInteractionData {
	id: string;
	name: string;
	options: ApplicationCommandInteractionDataOption[];
}

export interface ApplicationCommandInteractionDataOption {
	name: string;
	value: any;
	options: ApplicationCommandInteractionDataOption[];
}

export interface AckOptions {
	showUsage?: boolean;
	dm?: boolean;
	replyIfError?: boolean;
}

export class CommandInteraction extends Base {
	public channel: TextChannel;
	public guild: Guild;
	public id: string;
	public member: GuildMember;
	public token: string;
	public type: InteractionType;
	public started: number;
	public command: Command;
	public acknowledged: boolean;
	public args: Record<string, Argument>;

	constructor(client: LambertDiscordClient, private data: Interaction) {
		super(client);

		this._patch(data);
	}

	get valid() {
		// after 15 minutes the token expires
		if (Date.now() - this.started > 1000 * 60 * 15) throw new Error("Interaction token expired");
		return true;
	}

	_patch(data: Interaction) {
		if (data.version !== 1) throw new Error("Unkown Interaction version");
		this.channel = <TextChannel>this.client.channels.resolve(data.channel_id);
		this.guild = this.client.guilds.resolve(data.guild_id);
		this.id = data.id;
		this.member = this.guild.members.add(data.member);
		this.token = data.token;
		this.started = Date.now();
		this.command = this.client.registry.commands.modules.find((x) => x.slashId === data.data.id);
		if (!this.command) throw new Error("Slash Command not found");
	}

	async getArgs(): Promise<Record<string, Argument>> {
		let args: Record<string, Argument> = {};

		await Promise.all(
			(this.data.data.options || []).map(async (opt) => {
				let argument = this.command.args.find((arg) => arg.id === opt.name);
				if (!argument) throw new Error("Argument not found");

				let val = await argument.type.parse({ cmd: this.command, trigger: this, val: opt.value });
				// if (val == null) throw new Error("Couldn't parse argument value");
				args[opt.name] = val;
			})
		); // TODO: parse sub args
		this.args = args;
		return args;
	}

	async ack(options?: AckOptions, content?: StringResolvable, msg?: MessageOptions) {
		if (this.acknowledged) throw new Error("Already acknowledged message");
		this.acknowledged = true;
		if (!options) options = {};
		if (options.showUsage == null) options.showUsage = true;

		const resolved: any = await APIMessage.create(this.member, null, await transformSend.call(this, content, msg))
			.resolveData()
			.resolveFiles();

		if (!resolved.data.tts) delete resolved.data.tts;
		if (!resolved.data.content) delete resolved.data.content;
		const data = removeNull(resolved.data);
		// if (data) data.flags = options.dm ? 64 : 0;
		const type = options.showUsage ? (data ? 4 : 5) : data ? 3 : 2;

		try {
			return this.client.api.interactions(this.id, this.token).callback.post({
				data: {
					type,
					data: data,
				},
			});
		} catch (error) {
			if (options.replyIfError) {
				return this.reply(content, msg);
			}
		}
	}

	async reply(content: StringResolvable, options?: MessageOptions) {
		const resolved = await APIMessage.create(this.member, null, await transformSend.call(this, content, options))
			.resolveData()
			.resolveFiles();

		const res = await this.client.api.webhooks(this.client.options.application_id, this.token).post({
			auth: false,
			data: resolved.data,
			files: resolved.files,
		});

		return res;
	}
}
