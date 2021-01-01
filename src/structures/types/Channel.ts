import { Channel, Collection } from "discord.js";
import { ArgumentType } from "../ArgumentType";
import { ParseOptions } from "../ArgumentType";
import { ERRORS, LambertError } from "../LambertError";
const CHANNEL_PATTERN = /^(?:<#)?([0-9]+)>?$/;

export class ChannelType extends ArgumentType {
	constructor() {
		super({ id: "channel" });
		this.slashType = 7;
	}

	parse({ val, cmd, trigger }: ParseOptions) {
		val = val.toLowerCase();
		const mention = val.match(CHANNEL_PATTERN);
		let channel: Channel;
		if (mention) channel = trigger.guild.channels.resolve(mention[1]);
		else channel = getMostSimilarCache(val, trigger.guild.channels.cache, (x) => x.name);

		if (!channel) throw new LambertError(ERRORS.NOT_A_CHANNEL, val);
		return channel;
	}
}

export function getMostSimilarCache(val: string, cache: Collection<string, any>, prop: (x: any) => string) {
	let entries = cache
		.map((x) => ({
			entry: x,
			// @ts-ignore
			rating: val.similarity(prop(x)),
		}))
		.sort((a, b) => b.rating - a.rating)
		.map((x) => x.entry);

	return entries.first();
}
