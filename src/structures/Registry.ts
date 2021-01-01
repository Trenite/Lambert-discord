import { MessageOptions } from "discord.js";
import { LambertDiscordClient } from "./LambertDiscordClient";
import { ArgumentType } from "./ArgumentType";
import { Command } from "./Command";
import { CommandDispatcher } from "./CommandDispatcher";
import { CommandHandler, CommandHandlerOptions } from "./CommandHandler";
import { Handler } from "./Handler";
import { Inhibitor } from "./Inhibitor";
import { enforceLimits, MessageTransformer, embedMessageTransformer } from "./MessageTransformers";
import { Language } from "./Language";
import { LanguageHandler, LanguageHandlerOptions } from "./LanguageHandler";

export type MessageEmbedTypes = "error" | "warn" | "success" | "wait" | "noembed";

declare module "discord.js" {
	interface MessageOptions {
		type?: MessageEmbedTypes;
	}
}

export type RegistryOptions = {
	client: LambertDiscordClient;
	commands?: CommandHandlerOptions;
	language?: LanguageHandlerOptions;
};

export class Registry {
	public client: LambertDiscordClient;
	public dispatcher: CommandDispatcher;
	public commands: CommandHandler;
	public languages: LanguageHandler;
	public inhibitors: Handler<Inhibitor>;
	public events: Handler<Command>;
	public types: Handler<ArgumentType>;
	public messageTransformers: MessageTransformer[] = [embedMessageTransformer];

	constructor({ client, commands, language }: RegistryOptions) {
		this.client = client;
		this.dispatcher = new CommandDispatcher(client);
		this.commands = new CommandHandler({ ...commands, registry: this });
		this.languages = new LanguageHandler(language);
		this.inhibitors = new Handler({ id: "inhibitors" });
		this.events = new Handler({ id: "events" });
		this.types = new Handler({ id: "types" });
	}

	async init() {
		return Promise.all([
			this.commands.init(),
			this.events.init(),
			this.types.init(),
			this.inhibitors.init(),
			this.dispatcher.init(),
		]);
	}

	async destroy() {
		return Promise.all([
			this.commands.destroy(),
			this.events.destroy(),
			this.types.destroy(),
			this.inhibitors.destroy(),
			this.dispatcher.destroy(),
		]);
	}

	async registerDefault() {
		this.registerDefaultTypes(); // types need to be registered before commands

		return Promise.all([
			this.registerDefaultCommands(),
			this.registerDefaultInhibitors(),
			this.registerDefaultEvents(),
		]);
	}

	async registerDefaultCommands() {
		return this.commands.loadAll(__dirname + "/commands/");
	}
	async registerDefaultTypes() {
		return this.types.loadAll(__dirname + "/types/");
	}
	async registerDefaultInhibitors() {}
	async registerDefaultEvents() {}

	async transformMessage(opts: MessageOptions) {
		for (const transformer of this.messageTransformers) {
			try {
				opts = await transformer(opts);
			} catch (error) {}
		}
		return enforceLimits(opts);
	}
}
