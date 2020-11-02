import { Structures, GuildMember } from "discord.js";
import { LambertDiscordClient } from "../client/LambertDiscordClient";
import { LambertGuild } from "./LambertGuild";
import Datastore from "./Datastore";

export class LambertGuildMember extends GuildMember {
	public data: Datastore;

	constructor(client: LambertDiscordClient, data: any, guild: LambertGuild) {
		super(client, data, guild);
	}
}

Structures.extend("GuildMember", (GuildMember) => {
	return LambertGuildMember;
});
