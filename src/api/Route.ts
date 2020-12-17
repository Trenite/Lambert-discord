import { Channel, Guild, GuildMember, Role, User, Permissions, PermissionString } from "discord.js";
import { Request, Response } from "express";
import { LambertDiscordClient } from "..";
import { LambertPermissionResolvable } from "../structures/LambertPermission";
import { LambertRequestParamaters, patchRequest } from "./LambertRequest";
import { LambertServer } from "./LambertServer";

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

export type RouteOptions = {
	client: LambertDiscordClient;
	permissions?: LambertPermissionResolvable;
	parameter?: Omit<LambertRequestParamaters, "client">;
};

export async function check(options: RouteOptions) {
	return async (req: Request, res: Response, next: Function) => {
		var { permissions, parameter } = options;
		if (!permissions) permissions = [];
		if (!Array.isArray(permissions)) permissions = [permissions];
		if (!parameter) parameter = {};
		if (permissions.length && !parameter.member) parameter.user = true;
		// if (permissions.find((x) => PermissionString))

		await patchRequest(req, res, { ...parameter, client: options.client });

		await req.user?.hasAuths(permissions, true);
		await req.member?.hasAuths(permissions, true);
	};
}

// check({ permissions: "DEV" });
