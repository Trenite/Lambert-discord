import { GuildMember } from "discord.js";
import { ArgumentType } from "../ArgumentType";
import { ParseOptions } from "../ArgumentType";
import { ERRORS, LambertError } from "../LambertError";
import { getMostSimilarCache } from "./Channel";
const USER_PATTERN = /^(?:<@!?)?([0-9]+)>?$/;

export class MemberType extends ArgumentType {
	constructor() {
		super({ id: "member" });
		this.slashType = 6;
	}

	async parse({ val, cmd, trigger }: ParseOptions) {
		val = val.toLowerCase();
		const mention = val.match(USER_PATTERN);
		let member: GuildMember;

		if (mention) member = await trigger.guild.members.fetch(mention[1]).catch(() => (member = null));
		else member = <GuildMember>getMostSimilarCache(val, trigger.guild.members.cache, (x) => x.user.tag);

		if (!member) throw new LambertError(ERRORS.NOT_A_GUILD_MEMBER, val);
		return member;
	}
}
