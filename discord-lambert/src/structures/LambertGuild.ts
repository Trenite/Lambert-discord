import { Structures, Guild } from "discord.js";
import { LambertDiscordClient } from "../client/LambertDiscordClient";
import Datastore from "./Datastore";

export class LambertGuild extends Guild {
	public data: Datastore;

	constructor(client: LambertDiscordClient, data: any) {
		super(client, data);

		console.log("got guild", data);

		this.data = new Datastore(client);
	}
}

Structures.extend("Guild", (Guild) => {
	return LambertGuild;
});
