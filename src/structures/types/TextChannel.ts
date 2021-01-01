import { TextChannel } from "discord.js";
import { ArgumentType } from "../ArgumentType";
import { ParseOptions } from "../ArgumentType";
import { ERRORS, LambertError } from "../LambertError";
import { getMostSimilarCache } from "./Channel";
const CHANNEL_PATTERN = /^(?:<#)?([0-9]+)>?$/;

export class TextChannelType extends ArgumentType {
	constructor() {
		super({ id: "textchannel" });
		this.slashType = 7;
	}

	parse({ val, cmd, trigger }: ParseOptions) {
		val = val.toLowerCase();
		const mention = val.match(CHANNEL_PATTERN);
		let channel: TextChannel;
		if (mention) channel = <TextChannel>trigger.guild.channels.resolve(mention[1]);
		else
			channel = getMostSimilarCache(
				val,
				trigger.guild.channels.cache.filter((x) => !!(<TextChannel>x).messages),
				(x) => x.name
			);

		if (!channel || !channel.messages) throw new LambertError(ERRORS.NOT_A_TEXTCHANNEL, val);
		return channel;
	}
}
