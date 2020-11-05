import { Structures, GuildMember } from "discord.js";
import { LambertDiscordClient } from "../client/LambertDiscordClient";
import { Datastore } from "./Datastore";
import { LambertGuild } from "./LambertGuild";

export class LambertGuildMember extends GuildMember {
	constructor(public client: LambertDiscordClient, data: any, guild: LambertGuild) {
		super(client, data, guild);
	}

	public get data() {
		return Datastore(this.client, [
			{ name: "guilds", filter: { id: this.guild.id } },
			{ name: "members", filter: { id: this.id } },
		]);
	}
}

Structures.extend("GuildMember", (GuildMember) => {
	return LambertGuildMember;
});
