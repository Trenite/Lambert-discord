import { Channel, GuildEmoji, Message, Role, TextBasedChannel, TextChannel, Guild, GuildMember } from "discord.js";
import { Request, Response } from "express";
import { LambertDiscordClient } from "..";
import { LambertPermissionResolvable } from "../structures/LambertPermission";
import { LambertUser } from "../structures/LambertUser";
import { instanceOf } from "../util/instanceOf";
import { HTTPError } from "./HTTPError";

/**
 *
 * mgmt reverse proxy -> redirect request to shard:
 * General check:
 * - permission
 * - auth of reverse proxy
 * - require specific params with type:
 *
 * Command Check:
 * - command can check it self with function
 *
 * Request:
 * - mgmt (proxy)
 * 	optional:
 * - user
 * - guild
 * 	- role
 *  - emoji
 *  -
 * - member
 * - channel
 *	- message
 *
 */

export interface LambertRequestParamaters {
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
}

export async function patchRequest(req: Request, res: Response, parameter: LambertRequestParamaters) {
	function getValue(val: string) {
		return req.body[val] || req.headers[val];
	}

	const { client } = req;
	const { user, channel, member, message, emoji, guild, role, body } = parameter;
	if (!instanceOf(body, req.body, "body")) throw new Error("Invalid Request body");

	// fetch will automatically throw an error if entries aren't found
	// resolve will NOT throw an error -> manually throw it
	if (user) req.user = <LambertUser>await client.users.fetch(getValue("user"), false);
	if (channel) req.channel = await client.channels.fetch(getValue("channel"), false);
	if (message) {
		if (!channel || !req.channel) throw new HTTPError("channel must be enabled for message");
		// @ts-ignore check if it is a text channel
		if (!req.channel.messages) throw new HTTPError("must be a text channel");

		req.message = await (<TextChannel>req.channel).messages.fetch(getValue("message"), false);
	}
	if (guild) {
		req.guild = client.guilds.resolve(getValue("guild"));
		if (!req.guild) throw new HTTPError(`body.guild: '${getValue("guild")}' not found`, 404);
		if (!req.guild.available) throw new HTTPError("guild is not available", 504);
	}
	if (member) {
		if (!guild || !req.guild) throw "guild must be enabled for guildmember";
		req.member = await req.guild.members.fetch(getValue("member"));
	}
	if (emoji) {
		if (!guild || !req.guild) throw "guild must be enabled for emoji";
		req.emoji = <GuildEmoji | undefined>req.guild.emojis.resolve(getValue("emoji"));
		if (!req.emoji) throw new HTTPError("emoji not found", 404);
	}
	if (role) {
		if (!guild || !req.guild) throw "guild must be enabled for role";
		req.role = <Role | undefined>await req.guild.roles.fetch(getValue("role"));
	}

	// just to be sure if someone thinks the objects are in the request body/header
	req.body.user = req.user;
	req.body.channel = req.channel;
	req.body.message = req.message;
	req.body.guild = req.guild;
	req.body.member = req.member;
	req.body.emoji = req.emoji;
	req.body.role = req.role;

	// @ts-ignore
	req.headers.user = req.user; // @ts-ignore
	req.headers.channel = req.channel; // @ts-ignore
	req.headers.message = req.message; // @ts-ignore
	req.headers.guild = req.guild; // @ts-ignore
	req.headers.member = req.member; // @ts-ignore
	req.headers.emoji = req.emoji; // @ts-ignore
	req.headers.role = req.role;
}

export interface RouteOptions extends LambertRequestParamaters {
	permissions?: LambertPermissionResolvable;
}

export function check(options: RouteOptions) {
	return async (req: Request, res: Response, next: Function) => {
		var { permissions } = options;
		if (!permissions) permissions = [];
		if (!Array.isArray(permissions)) permissions = [permissions];
		if (permissions.length && !options.member) options.user = true;
		// if (permissions.find((x) => PermissionString))

		await patchRequest(req, res, options);

		await req.user?.hasAuths(permissions, true);
		await req.member?.hasAuths(permissions, true);

		next();
	};
}

declare global {
	namespace Express {
		interface Request {
			client: LambertDiscordClient;
			user?: LambertUser;
			channel?: Channel;
			message?: Message;
			guild?: Guild;
			member?: GuildMember;
			emoji?: GuildEmoji;
			role?: Role;
		}
	}
}
