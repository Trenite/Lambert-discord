import { Message, TextChannel } from "discord.js";
import { ArgumentType } from "../ArgumentType";
import { ParseOptions } from "../ArgumentType";
import { ERRORS, LambertError } from "../LambertError";

const MESSAGE_LINK = /^https?:\/\/(canary\.|ptb\.)?discord(app)?.com\/channels\/((\d+)|(@me))\/(\d+)\/(\d+)/;

export class MessageType extends ArgumentType {
	constructor() {
		super({ id: "message" });
		this.slashType = 3;
	}

	// https://discord.com/channels/@me/565224190362517505/791286029701218326
	async parse({ val, cmd, trigger }: ParseOptions) {
		val = val.toLowerCase();
		const link = val.match(MESSAGE_LINK);
		let message: Message;
		let channel: TextChannel;
		let guildid: string;
		let channelid: string;
		let messageid: string;

		if (link) {
			guildid = link[3];
			channelid = link[6];
			messageid = link[7];
		} else if ((<Message>trigger).reference) {
			trigger = <Message>trigger;
			guildid = trigger.reference.guildID;
			channelid = trigger.reference.channelID;
			messageid = trigger.reference.messageID;
		} else {
			guildid = trigger.guild.id;
			channelid = trigger.channel.id;
			messageid = val;
		}

		if (trigger.guild && guildid !== trigger.guild.id) throw new LambertError(ERRORS.DIFFERENT_GUILD, val);

		if (trigger.guild) channel = <TextChannel>trigger.guild.channels.resolve(channelid);
		else channel = <TextChannel>trigger.client.channels.resolve(channelid);
		if (!channel) throw new LambertError(ERRORS.NOT_A_CHANNEL, val);
		if (!channel.messages) throw new LambertError(ERRORS.NOT_A_TEXTCHANNEL, val);

		try {
			message = await channel.messages.fetch(messageid);
			if (!message) throw "msg not found";
		} catch (error) {
			throw new LambertError(ERRORS.NOT_A_MESSAGE, val);
		}

		return message;
	}
}
