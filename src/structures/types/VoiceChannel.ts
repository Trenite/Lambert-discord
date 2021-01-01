import { VoiceChannel } from "discord.js";
import { ArgumentType } from "../ArgumentType";
import { ParseOptions } from "../ArgumentType";
import { ERRORS, LambertError } from "../LambertError";
import { getMostSimilarCache } from "./Channel";
const CHANNEL_PATTERN = /^(?:<#)?([0-9]+)>?$/;

export class VoiceChannelType extends ArgumentType {
	constructor() {
		super({ id: "voicechannel" });
		this.slashType = 7;
	}

	parse({ val, cmd, trigger }: ParseOptions) {
		val = val.toLowerCase();
		const mention = val.match(CHANNEL_PATTERN);
		let channel: VoiceChannel;
		if (mention) channel = <VoiceChannel>trigger.guild.channels.resolve(mention[1]);
		else
			channel = getMostSimilarCache(
				val,
				trigger.guild.channels.cache.filter((x) => !!(<VoiceChannel>x).join),
				(x) => x.name
			);

		if (!channel || !channel.join) throw new LambertError(ERRORS.NOT_A_VOICECHANNEL, val);
		return channel;
	}
}
