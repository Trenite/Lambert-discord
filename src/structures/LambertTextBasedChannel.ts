import { APIMessage, DMChannel, NewsChannel, TextBasedChannel, TextChannel, MessageOptions } from "discord.js";

let oldSend = TextBasedChannel.prototype.send;

TextBasedChannel.prototype.send = function (
	this: TextChannel | DMChannel | NewsChannel,
	content: string | any,
	options: any
) {
	if (!options && typeof content === "object" && !Array.isArray(content)) {
		options = content;
		content = undefined;
	}

	const opts = <MessageOptions>APIMessage.transformOptions(content, options, {}, false);
	const transformed = this.client?.registry.messageTransformer.call(this, opts);

	return oldSend(null, transformed);
};
