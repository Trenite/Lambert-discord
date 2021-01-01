import { Channel, GuildEmoji, Message, Role, Guild, GuildMember } from "discord.js";
import { Request, Response } from "express";
import { LambertDiscordClient } from "..";
import { LambertPermissionResolvable } from "../structures/LambertPermission";
import { LambertUser } from "../structures/LambertUser";
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
export declare function patchRequest(req: Request, res: Response, parameter: LambertRequestParamaters): Promise<void>;
export interface RouteOptions extends LambertRequestParamaters {
    permissions?: LambertPermissionResolvable;
}
export declare function check(options: RouteOptions): (req: Request, res: Response, next: Function) => Promise<void>;
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
