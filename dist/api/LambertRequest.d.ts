import { Channel, GuildEmoji, Message, Role } from "discord.js";
import { Request, Response } from "express";
import { LambertDiscordClient } from "..";
import { LambertGuildMember } from "../structures/LambertExtended";
import { LambertGuild } from "../structures/LambertGuild";
import { LambertUser } from "../structures/LambertUser";
export declare type LambertRequestParamaters = {
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
export declare function patchRequest(req: Request, res: Response, parameter: LambertRequestParamaters): Promise<void>;
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
//# sourceMappingURL=LambertRequest.d.ts.map