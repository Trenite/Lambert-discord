import { Structures, GuildMember, PermissionString, Permissions } from "discord.js";
import { Mixin } from "ts-mixer";
import { LambertDiscordClient } from "../client/LambertDiscordClient";
import { Auth } from "./Auth";
import { Datastore } from "./Provider";
import { LambertGuild } from "./LambertGuild";
import { LambertError } from "./LambertError";

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

	hasPermission(auth: PermissionString | PermissionString[]): boolean {
		if (typeof auth === "string") if (!Object.keys(Permissions.FLAGS).includes(auth)) return true;
		if (Array.isArray(auth)) auth = auth.filter((auth) => Object.keys(Permissions.FLAGS).includes(auth));

		return super.hasPermission(auth);
	}

	async hasAuth(auth: string, throwError?: boolean) {
		var hasAuth = await super.hasAuth(auth, throwError);
		var hasPerm = this.hasPermission(<PermissionString>auth);
		if (throwError && !hasPerm) throw new LambertError("Missing permission", auth);
		return hasAuth && hasPerm;
	}

	async hasAuths(auths: string[] | string, throwError?: boolean) {
		if (!auths) return true;
		if (!Array.isArray(auths)) auths = [auths];
		if (!auths.length) return true;

		var hasAuth = await super.hasAuths(auths, throwError);
		var hasPerm = this.hasPermission(<PermissionString[]>auths);
		if (throwError && !hasPerm) throw new LambertError("Missing Permissions", auths);
		return hasAuth && hasPerm;
	}
}

Structures.extend("GuildMember", (GuildMember) => {
	return LambertGuildMember;
});
