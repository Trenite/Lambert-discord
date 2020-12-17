import { Guild } from "discord.js";
import { LambertDiscordClient } from "../client/LambertDiscordClient";
export declare class LambertGuild extends Guild {
    client: LambertDiscordClient;
    _prefix: import("./ProviderCache").ProviderCache;
    constructor(client: LambertDiscordClient, data: any);
    init(): Promise<void>;
    get prefix(): any;
    get data(): import("./Provider").DatastoreType;
    destroy(): Promise<void>;
}
//# sourceMappingURL=LambertGuild.d.ts.map