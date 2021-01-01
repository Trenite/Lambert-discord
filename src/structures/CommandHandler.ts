import { Command } from "./Command";
import { Handler } from "./Handler";
import { Collection } from "discord.js";
import { Registry } from "./Registry";
import { LambertDiscordClient } from "..";
import { ApplicationCommand } from "./ApplicationCommand";

export interface CommandHandlerOptions {
	slashCommands?: boolean;
	registry: Registry;
}

export class CommandHandler extends Handler<Command> {
	public readonly categories: Collection<string, Command[]> = new Collection();
	public options: CommandHandlerOptions;
	public registry: Registry;
	public client: LambertDiscordClient;
	public slashCommands: ApplicationCommand[];

	constructor(opts: CommandHandlerOptions) {
		super({ id: "commands" });
		if (opts.slashCommands == undefined) opts.slashCommands = true;

		this.options = opts;
		this.registry = opts.registry;
		this.client = this.registry.client;
	}

	async init() {
		if (this.options.slashCommands) {
			const { application_id } = this.client.options;
			this.slashCommands = await this.client.api
				.applications(application_id)
				.guilds("683026970606567440")
				.commands.get();
		}

		setTimeout(() => {
			// TODO: after all commands were loaded check if commands were removed since the last start
		}, 1000 * 60);
	}

	async register(mod: Command) {
		await this.client.initalized;

		await super.register(mod);
		const category = this.categories.get(mod.categoryId) || [];
		this.categories.set(mod.categoryId, category);
		category.push(mod);

		mod.category = category;
		mod.client = this.client;

		let exists = { ...this.slashCommands.find((x) => x.name === mod.id) };
		mod.slashId = exists.id;
		delete exists.application_id;
		delete exists.id;

		const data = mod.toSlashCommand();
		if (JSON.stringify(exists) !== JSON.stringify(data)) {
			const { application_id } = this.client.options;

			const { id } = await this.client.api
				.applications(application_id)
				.guilds("683026970606567440")
				.commands.post({ data });
			// TODO test if it really returns id
			mod.slashId = id;
		}

		return mod;
	}

	async remove(id: string) {
		const mod = this.modules.get(id);
		if (!mod) throw new Error("Module not found");
		const category = this.categories.get(mod.categoryId) || [];
		category.remove(mod);
		if (category.length === 0) {
			this.categories.delete(mod.categoryId);
		}
		return super.remove(id);
	}
}
