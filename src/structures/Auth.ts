import { Permissions } from "discord.js";
import { ERRORS, LambertError } from "./LambertError";

export class Auth {
	// @ts-ignore
	public abstract get data(): any;

	async hasAuth(auth: string, throwError?: boolean) {
		if (await this.data.auth[auth].get()) return true;
		if (throwError) throw new LambertError(ERRORS.MISSING_PERMISSION, auth);
		if (Object.keys(Permissions.FLAGS).includes(auth)) return true;
		return false;
	}

	async hasAuths(auths: string[] | string, throwError?: boolean) {
		if (!auths) return true;
		if (!Array.isArray(auths)) auths = [auths];
		if (!auths.length) return true;
		var perms = await this.getAuths();
		auths = auths.filter((auth) => !Object.keys(Permissions.FLAGS).includes(auth));

		var missing = auths.filter((auth) => !!perms[auth]);
		if (throwError && missing.length) throw new LambertError(ERRORS.MISSING_PERMISSIONS, missing);
		return !!missing.length;
	}

	async setAuth(auth: string, value: boolean) {
		return <boolean>await this.data.auth[auth].set(value);
	}

	async getAuths(): Promise<any> {
		return (await this.data.auth.get()) || {};
	}
}
