import { MessageOptions } from "discord.js";
import { Command } from "./Command";
import { Handler } from "./Handler";
import { Inhibitor } from "./Inhibitor";

export class Registry {
	public commands: Handler<Command> = new Handler("commands");
	public inhibitors: Handler<Inhibitor> = new Handler("inhibitors");
	public events: Handler<Command> = new Handler("events");
	public types: Handler<Command> = new Handler("types");
	public messageTransformer: (opts: MessageOptions) => MessageOptions = (x) => x;

	async init() {
		return Promise.all([this.commands.destroy(), this.events.init(), this.types.init(), this.inhibitors.init()]);
	}

	async registerDefault() {
		return Promise.all([
			this.registerDefaultCommands(),
			this.registerDefaultTypes(),
			this.registerDefaultInhibitors(),
			this.registerDefaultEvents(),
			this.registerDefaultMessageTransformers(),
		]);
	}

	async registerDefaultCommands() {}
	async registerDefaultTypes() {}
	async registerDefaultInhibitors() {}
	async registerDefaultEvents() {}
	async registerDefaultMessageTransformers() {}

	async destroy() {
		return Promise.all([
			this.commands.destroy(),
			this.events.destroy(),
			this.types.destroy(),
			this.inhibitors.destroy(),
		]);
	}
}
