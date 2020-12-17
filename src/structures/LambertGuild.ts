import { Structures, Guild } from "discord.js";
import { LambertDiscordClient } from "../client/LambertDiscordClient";
import { Datastore } from "./Provider";

export class LambertGuild extends Guild {
	public _prefix = this.data.prefix.__getProvider().cache;

	constructor(public client: LambertDiscordClient, data: any) {
		super(client, data);

		// console.log("got guild", data);
		this.init();
	}

	async init() {
		return this._prefix.init();
	}

	get prefix() {
		return this._prefix.get() || this.client.options.commandPrefix;
	}

	public get data() {
		return Datastore(this.client, [{ name: "guilds", filter: { id: this.id } }, { name: "data" }]);
	}

	async destroy() {
		return this._prefix.destroy();
	}
}

// const guilds: any[] = await this.client.data.guilds({ shardID: this.client.options.shards }).get();

Structures.extend("Guild", (Guild) => {
	return LambertGuild;
});
