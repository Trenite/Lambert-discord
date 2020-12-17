import { GuildMember, PermissionString } from "discord.js";
import { LambertDiscordClient } from "../client/LambertDiscordClient";
import { Auth } from "./Auth";
import { LambertGuild } from "./LambertGuild";
declare const LambertGuildMember_base: import("ts-mixer/dist/types").Class<[client: import("discord.js").Client, data: object, guild: import("discord.js").Guild], GuildMember & Auth, {
    prototype: GuildMember;
} & {
    prototype: Auth;
}>;
export declare class LambertGuildMember extends LambertGuildMember_base {
    client: LambertDiscordClient;
    constructor(client: LambertDiscordClient, data: any, guild: LambertGuild);
    get data(): import("./Provider").DatastoreType;
    hasPermission(auth: PermissionString | PermissionString[]): boolean;
    hasAuth(auth: string, throwError?: boolean): Promise<boolean>;
    hasAuths(auths: string[] | string, throwError?: boolean): Promise<boolean>;
}
export {};
//# sourceMappingURL=LambertGuildMember.d.ts.map