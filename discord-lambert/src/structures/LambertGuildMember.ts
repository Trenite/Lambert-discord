import { Structures, GuildMember, PermissionString } from "discord.js";
import { Mixin } from "ts-mixer";
import { LambertDiscordClient } from "../client/LambertDiscordClient";
import { Auth } from "./Auth";
import { Datastore } from "./Datastore";
import { LambertGuild } from "./LambertGuild";

export class LambertGuildMember extends Mixin(GuildMember, Auth) {
	constructor(public client: LambertDiscordClient, data: any, guild: LambertGuild) {
		super(client, data, guild);
	}

	public get data() {
		return Datastore(this.client, [
			{ name: "guilds", filter: { id: this.guild.id } },
			{ name: "members", filter: { id: this.id } },
		]);
	}

	async hasAuth(auth: string, throwError?: boolean) {
		var hasAuth = await super.hasAuth(auth, throwError);
		var hasPerm = this.hasPermission(<PermissionString>auth);
		if (throwError && !hasPerm) throw `You are missing ${auth} permission`;
		return hasAuth && hasPerm;
	}

	async hasAuths(auths: string[], throwError?: boolean) {
		var hasAuth = await super.hasAuths(auths, throwError);
		var hasPerm = this.hasPermission(<PermissionString[]>auths);
		if (throwError && !hasPerm) throw `You are missing some of ${auths.join(", ")} permissions`;
		return hasAuth && hasPerm;
	}
}

Structures.extend("GuildMember", (GuildMember) => {
	return LambertGuildMember;
});
