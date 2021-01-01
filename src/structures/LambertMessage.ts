import { Message, StringResolvable, MessageOptions } from "discord.js";
import { inherits } from "util";
import { Command } from "./Command";
import { AckOptions } from "./CommandInteraction";

declare module "discord.js" {
	interface Message {
		prefix?: string; // the prefix if the message triggered a cmd
		cmdName?: string; // cmdName if the message triggered a cmd
		cmd?: Command; // the cmd object if the message triggered a cmd

		ack(options?: AckOptions, content?: StringResolvable, msg?: MessageOptions): Promise<any>;
	}
}
export interface LambertMessage extends Message {}

export class LambertMessage {
	private acknowledged: boolean;

	async ack(options?: AckOptions, content?: StringResolvable, msg?: MessageOptions) {
		if (this.acknowledged) throw new Error("Already acknowledged message");
		this.acknowledged = true;
		if (content && msg) {
			return this.reply(content, msg);
		}
		return;
	}
}

Message.prototype.ack = LambertMessage.prototype.ack;
