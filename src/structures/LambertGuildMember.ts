import { GuildMember, PermissionString, Permissions, Base } from "discord.js";
import { Auth } from "./Auth";
import { ERRORS, LambertError } from "./LambertError";
import { Datastore } from "lambert-db";
import { DatastoreInterface } from "lambert-db/dist/Datastore";
import { inherits } from "util";

declare module "discord.js" {
	interface GuildMember extends Auth {
		data: DatastoreInterface;
		hasPermission(auth: PermissionString | PermissionString[]): boolean;
	}
}

export interface LambertGuildMember extends GuildMember {}
export interface LambertGuildMember extends Auth {}

export class LambertGuildMember {
	public get data() {
		return Datastore(this.client.db, [
			{ name: "guilds", filter: { id: this.guild.id } },
			{ name: "members", filter: { id: this.id } },
		]);
	}

	hasPermission(auth: PermissionString | PermissionString[]): boolean {
		if (typeof auth === "string") if (!Object.keys(Permissions.FLAGS).includes(auth)) return true;
		if (Array.isArray(auth)) auth = auth.filter((auth) => Object.keys(Permissions.FLAGS).includes(auth));

		return oldHasPermission(auth);
	}

	async hasAuth(auth: string, throwError?: boolean) {
		// @ts-ignore
		var hasAuth = await Auth.prototype.hasAuth.call(this, auth, throwError);
		var hasPerm = this.hasPermission(<PermissionString>auth);
		if (throwError && !hasPerm) throw new LambertError(ERRORS.MISSING_PERMISSION, auth);
		return hasAuth && hasPerm;
	}

	async hasAuths(auths: string[] | string, throwError?: boolean) {
		if (!auths) return true;
		if (!Array.isArray(auths)) auths = [auths];
		if (!auths.length) return true;

		// @ts-ignore
		var hasAuth = Auth.prototype.hasAuths.call(this, auths, throwError);
		var hasPerm = this.hasPermission(<PermissionString[]>auths);
		if (throwError && !hasPerm) throw new LambertError(ERRORS.MISSING_PERMISSIONS, auths);
		return hasAuth && hasPerm;
	}
}

GuildMember.prototype.hasAuths = LambertGuildMember.prototype.hasAuths;
GuildMember.prototype.hasAuth = LambertGuildMember.prototype.hasAuth;
const oldHasPermission = GuildMember.prototype.hasPermission;
GuildMember.prototype.hasPermission = LambertGuildMember.prototype.hasPermission;

Object.defineProperties(GuildMember.prototype, {
	hasAuths: Object.getOwnPropertyDescriptor(LambertGuildMember.prototype, "hasAuths"),
	hasAuth: Object.getOwnPropertyDescriptor(LambertGuildMember.prototype, "hasAuth"),
	hasPermission: Object.getOwnPropertyDescriptor(LambertGuildMember.prototype, "hasPermission"),
	data: Object.getOwnPropertyDescriptor(LambertGuildMember.prototype, "data"),
});
// TODO: proper patch function (this problem)
