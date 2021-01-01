import { CategoryChannel } from "discord.js";
import { VoiceChannel } from "discord.js";
import { ArgumentType } from "../ArgumentType";
import { ParseOptions } from "../ArgumentType";
import { ERRORS, LambertError } from "../LambertError";
import { getMostSimilarCache } from "./Channel";

const CHANNEL_PATTERN = /^(?:<#)?([0-9]+)>?$/;

export class CategoryChannelType extends ArgumentType {
	constructor() {
		super({ id: "categorychannel" });
		this.slashType = 7;
	}

	parse({ val, cmd, trigger }: ParseOptions) {
		val = val.toLowerCase();
		const mention = val.match(CHANNEL_PATTERN);

		let channel: CategoryChannel;
		if (mention) channel = <CategoryChannel>trigger.guild.channels.resolve(mention[1]);
		else
			channel = getMostSimilarCache(
				val,
				trigger.guild.channels.cache.filter((x) => (<CategoryChannel>x).type === "category"),
				(x) => x.name
			);

		if (!channel || channel.type !== "category") throw new LambertError(ERRORS.NOT_A_CATEGORYCHANNEL, val);
		return channel;
	}
}
