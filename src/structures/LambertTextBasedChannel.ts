import {
	APIMessage,
	TextChannel,
	MessageOptions,
	StringResolvable,
	CollectorFilter,
	AwaitMessagesOptions,
	Message,
	Collection,
	DMChannel,
} from "discord.js";
import { LambertDiscordClient } from "./LambertDiscordClient";

// @ts-ignore
export interface LambertTextBasedChannel extends TextChannel {}

export class LambertTextBasedChannel {
	async send(oldSend: any, content: StringResolvable, options: MessageOptions): Promise<Message[] | Message> {
		const transformed = await transformSend.call(this, content, options);
		return oldSend.call(this, null, transformed);
	}

	async awaitMessages(oldAwaitMessages: any, filter: CollectorFilter, options?: AwaitMessagesOptions) {
		if (!options) options = {};
		if (!options.errors) options.errors = ["time"];
		if (!options.time) options.time = 30000;
		if (!options.max) options.max = 1;

		const result: Collection<string, Message> = await oldAwaitMessages.call(this, filter, options);

		if (options.max === 1) {
			return result.first();
		}

		return result;
	}
}

export async function transformSend(content: StringResolvable, options: MessageOptions): Promise<MessageOptions> {
	if (!options && typeof content === "object" && !Array.isArray(content)) {
		options = content;
		content = undefined;
	}

	const opts = <MessageOptions>APIMessage.transformOptions(content, options, {}, false);
	const { registry } = <LambertDiscordClient>this.client;

	return await registry.transformMessage(opts);
}

const oldTextChannelSend = TextChannel.prototype.send;
// @ts-ignore
TextChannel.prototype.send = function (content: any, options: any) {
	LambertTextBasedChannel.prototype.send.call(this, oldTextChannelSend, content, options);
};

const oldTextChannelAwaitMessages = TextChannel.prototype.awaitMessages;
// @ts-ignore
TextChannel.prototype.awaitMessages = function (content: any, options: any) {
	LambertTextBasedChannel.prototype.awaitMessages.call(this, oldTextChannelAwaitMessages, content, options);
};

const oldDMChannelSend = DMChannel.prototype.send;
// @ts-ignore
DMChannel.prototype.send = function (content: any, options: any) {
	LambertTextBasedChannel.prototype.send.call(this, oldDMChannelSend, content, options);
};

const oldDMChannelAwaitMessages = DMChannel.prototype.awaitMessages;
// @ts-ignore
DMChannel.prototype.awaitMessages = function (content: any, options: any) {
	LambertTextBasedChannel.prototype.awaitMessages.call(this, oldDMChannelAwaitMessages, content, options);
};
