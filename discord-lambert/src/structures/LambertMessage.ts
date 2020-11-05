import { Structures, Message, TextChannel, DMChannel, NewsChannel } from "discord.js";
import { LambertDiscordClient } from "../client/LambertDiscordClient";

export class LambertMessage extends Message {
	constructor(client: LambertDiscordClient, data: any, channel: TextChannel | DMChannel | NewsChannel) {
		super(client, data, channel);

		// console.log("got Message", data);
	}
}

Structures.extend("Message", (Message) => {
	return LambertMessage;
});
