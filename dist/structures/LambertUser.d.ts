import { User } from "discord.js";
import { LambertDiscordClient } from "../client/LambertDiscordClient";
import { Auth } from "./Auth";
declare const LambertUser_base: import("ts-mixer/dist/types").Class<[client: import("discord.js").Client, data: object], User & Auth, {
    prototype: User;
} & {
    prototype: Auth;
}>;
export declare class LambertUser extends LambertUser_base {
    client: LambertDiscordClient;
    constructor(client: LambertDiscordClient, data: any);
    get data(): import("./Provider").DatastoreType;
}
export {};
//# sourceMappingURL=LambertUser.d.ts.map