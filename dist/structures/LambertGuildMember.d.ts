import { GuildMember, PermissionString } from "discord.js";
import { Auth } from "./Auth";
import { DatastoreInterface } from "lambert-db/dist/Datastore";
declare module "discord.js" {
    interface GuildMember extends Auth {
        data: DatastoreInterface;
        hasPermission(auth: PermissionString | PermissionString[]): boolean;
    }
}
export interface LambertGuildMember extends GuildMember {
}
export interface LambertGuildMember extends Auth {
}
export declare class LambertGuildMember {
    get data(): DatastoreInterface;
    hasPermission(auth: PermissionString | PermissionString[]): boolean;
    hasAuth(auth: string, throwError?: boolean): Promise<boolean>;
    hasAuths(auths: string[] | string, throwError?: boolean): Promise<boolean>;
}
