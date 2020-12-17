import { Channel, GuildEmoji, Message, Role, TextBasedChannel, TextChannel } from "discord.js";
import { Request, Response } from "express";
import { LambertDiscordClient } from "..";
import { LambertGuildMember } from "../structures/LambertExtended";
import { LambertGuild } from "../structures/LambertGuild";
import { LambertUser } from "../structures/LambertUser";
import { instanceOf } from "../util/instanceOf";

export type LambertRequestParamaters = {
	client: LambertDiscordClient;
	user?: boolean;
	channel?: boolean;
	message?: boolean;
	guild?: boolean;
	member?: boolean;
	emoji?: boolean;
	role?: boolean;
	body?: {
		[index: string]: any;
	};
};

export async function patchRequest(req: Request, res: Response, parameter: LambertRequestParamaters) {
	const { client, user, channel, member, message, emoji, guild, role, body } = parameter;

	// fetch will automatically throw an error if entries aren't found
	// resolve will NOT throw an error -> manually throw it
	if (user) req.user = <LambertUser>await client.users.fetch(req.body.user, false);
	if (channel) req.channel = await client.channels.fetch(req.body.channel, false);
	if (message) {
		if (!channel || !req.channel) throw "channel must be enabled for message";
		// @ts-ignore check if it is a text channel
		if (!req.channel.messages) throw "must be a text channel";

		req.message = await (<TextChannel>req.channel).messages.fetch(req.body.message, false);
	}
	if (guild) {
		req.guild = <LambertGuild>client.guilds.resolve(req.body.guild);
		if (!req.guild) throw "guild not found";
		if (!req.guild.available) throw "guild is not available";
	}
	if (member) {
		if (!guild || !req.guild) throw "guild must be enabled for guildmember";
		req.member = <LambertGuildMember>await req.guild.members.fetch(req.body.member);
	}
	if (emoji) {
		if (!guild || !req.guild) throw "guild must be enabled for emoji";
		req.emoji = <GuildEmoji | undefined>req.guild.emojis.resolve(req.body.emoji);
		if (!req.emoji) throw "emoji not found";
	}
	if (role) {
		if (!guild || !req.guild) throw "guild must be enabled for role";
		req.role = <Role | undefined>await req.guild.roles.fetch(req.body.role);
	}

	req.body.user = req.user;
	req.body.channel = req.channel;
	req.body.message = req.message;
	req.body.guild = req.guild;
	req.body.member = req.member;
	req.body.emoji = req.emoji;
	req.body.role = req.role;

	instanceOf(req.body, body);
}

declare global {
	namespace Express {
		interface Request {
			client: LambertDiscordClient;
			user?: LambertUser;
			channel?: Channel;
			message?: Message;
			guild?: LambertGuild;
			member?: LambertGuildMember;
			emoji?: GuildEmoji;
			role?: Role;
		}
	}
}
