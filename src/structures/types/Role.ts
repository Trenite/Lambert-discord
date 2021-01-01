import { Role, Collection } from "discord.js";
import { ArgumentType } from "../ArgumentType";
import { ParseOptions } from "../ArgumentType";
import { ERRORS, LambertError } from "../LambertError";
import { getMostSimilarCache } from "./Channel";
const ROLE_PATTERN = /^(?:<@&)?([0-9]+)>?$/;

export class RoleType extends ArgumentType {
	constructor() {
		super({ id: "role" });
		this.slashType = 8;
	}

	parse({ val, cmd, trigger }: ParseOptions) {
		val = val.toLowerCase();
		const mention = val.match(ROLE_PATTERN);
		let role: Role;

		if (!trigger.guild) throw new LambertError(ERRORS.GUILD_ONLY, { command: cmd, trigger });

		if (mention) role = trigger.guild.roles.resolve(mention[1]);
		else role = getMostSimilarCache(val, trigger.guild.roles.cache, (x) => x.name);

		if (!role) throw new LambertError(ERRORS.NOT_A_ROLE, val);
		return role;
	}
}
