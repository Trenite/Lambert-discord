import { User } from "discord.js";
import { ArgumentType } from "../ArgumentType";
import { ParseOptions } from "../ArgumentType";
import { ERRORS, LambertError } from "../LambertError";
import { getMostSimilarCache } from "./Channel";
const USER_PATTERN = /^(?:<@!?)?([0-9]+)>?$/;

export class UserType extends ArgumentType {
	constructor() {
		super({ id: "user" });
		this.slashType = 6;
	}

	async parse({ val, cmd, trigger }: ParseOptions) {
		val = val.toLowerCase();
		const mention = val.match(USER_PATTERN);
		let user: User;

		if (mention) user = await trigger.client.users.fetch(mention[1]).catch(() => (user = null));
		else user = <User>getMostSimilarCache(val, trigger.client.users.cache, (x) => x.user.tag);

		if (!user) throw new LambertError(ERRORS.NOT_A_USER, val);
		return user;
	}
}
