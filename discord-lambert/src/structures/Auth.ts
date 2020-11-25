export class Auth {
	// @ts-ignore
	public abstract get data(): any;

	async hasAuth(auth: string, throwError?: boolean) {
		if (await this.data.auth[auth].get()) return true;
		if (throwError) throw `You are missing ${auth} permission`;
		return false;
	}

	async hasAuths(auths: string[], throwError?: boolean) {
		if (!auths.length) return true;
		var perms = await this.getAuths();
		var missing = auths.filter((auth) => !!perms[auth]);
		if (throwError && missing.length) throw `You are missing ${missing.join(", ")} permissions`;
		return !!missing.length;
	}

	async setAuth(auth: string, value: boolean) {
		return <boolean>await this.data.auth[auth].set(value);
	}

	async getAuths(): Promise<any> {
		return (await this.data.auth.get()) || {};
	}
}
