import { MessageAttachment, EmbedField, MessageOptions, MessageEmbed } from "discord.js";

export const imageFormats = ["jpg", "jpeg", "png", "gif"];

export const authors = {
	error: {
		iconURL: "https://cdn.discordapp.com/emojis/713500900546838640.png",
		name: "Error",
	},
	success: {
		iconURL: "https://cdn.discordapp.com/emojis/714235674533822515.gif",
		name: "Success",
	},
	wait: {
		iconURL: "https://cdn.discordapp.com/emojis/713500751350988850.gif",
	},
	warn: {
		iconURL: "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/twitter/259/warning_26a0.png",
		name: "Warn",
	},
};

export async function embedMessageTransformer(opts: MessageOptions) {
	if (!opts) return opts;
	if (opts instanceof MessageAttachment) return opts;
	if (opts instanceof MessageEmbed) opts = (<MessageEmbed>opts).toJSON();
	if (opts.type === "noembed") return opts;
	if (!opts.embed) {
		opts.embed = {
			description: opts.content,
		};
		delete opts.content;
	}
	if (!opts.embed.image) opts.embed.image = {};
	if (!opts.embed.author) opts.embed.author = {};
	if (!opts.embed.fields) opts.embed.fields = [];
	if (!opts.files) opts.files = [];

	const file = <MessageAttachment>opts.files.first();
	if (file && imageFormats.includes(file.name.split(".").last())) {
		opts.embed.image.url = `attachment://${file.name}`;
	}

	opts.embed.author = { ...authors[opts.type], ...opts.embed.author };

	return opts;
}

function limit(val: string | undefined, limit: number) {
	if (!val) return val;
	if (val.length <= limit) return val;
	return val.slice(0, limit - 4) + " ...";
}

export function enforceLimits(opts: MessageOptions) {
	// TODO: check total limit of 6000 chars

	if (!opts) return opts;
	if (!opts.embed) opts.embed = {};
	if (!opts.embed.author) opts.embed.author = {};
	if (!opts.embed.footer) opts.embed.footer = {};
	if (!opts.embed.fields) opts.embed.fields = [];
	if (!opts.files) opts.files = [];
	opts.content = limit(opts.content, 2000);
	opts.embed.author.name = limit(opts.embed.author.name, 256);
	opts.embed.footer.text = limit(opts.embed.footer.text, 2048);
	opts.embed.title = limit(opts.embed.title, 256);

	var fields: EmbedField[] = [];

	function limitField(field: EmbedField) {
		if (!field) return;
		field.name = limit(`${field.name}`, 256);
		field.value = `${field.value}`;

		if (field.value.length > 1024) {
			var i = field.value.slice(0, 1024).lastIndexOf("\n");
			if (i === -1) {
				i = 1024;
			}
			fields.push({ name: field.name, value: field.value.slice(0, i), inline: field.inline });
			limitField({ ...field, value: field.value.slice(i) });
		} else {
			fields.push(field);
		}
	}

	opts.embed.fields.forEach(limitField);
	opts.embed.fields = fields;

	return removeNull(opts);
}

export function removeNull(obj: any) {
	if (obj == null) return undefined;

	Object.keys(obj).forEach((key) => {
		if (typeof obj[key] === "object") obj[key] = removeNull(obj[key]);
		if (obj[key] == null) {
			delete obj[key];
		}
	});
	if (!Object.keys(obj).length) return undefined;

	return obj;
}

export type MessageTransformer = (opts: MessageOptions) => Promise<MessageOptions>;
