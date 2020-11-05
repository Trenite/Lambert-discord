import { Structures, Guild } from "discord.js";
import { LambertDiscordClient } from "../client/LambertDiscordClient";
import { Datastore } from "./Datastore";

export class LambertGuild extends Guild {
	constructor(public client: LambertDiscordClient, data: any) {
		super(client, data);

		// console.log("got guild", data);
	}

	public get data() {
		return Datastore(this.client, [{ name: "guilds", filter: { id: this.id } }, { name: "data" }]);
	}
}

Structures.extend("Guild", (Guild) => {
	return LambertGuild;
});
