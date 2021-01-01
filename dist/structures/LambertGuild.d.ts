import { Guild } from "discord.js";
import { ProviderCache } from "lambert-db";
import { DatastoreInterface } from "lambert-db/dist/Datastore";
declare module "discord.js" {
    interface Guild {
        _prefix: ProviderCache;
        prefix: string;
        data: DatastoreInterface;
        init(): Promise<any>;
        destroy(): Promise<any>;
        _patch(data: any): void;
    }
}
export interface LambertGuild extends Guild {
}
export declare class LambertGuild {
    _patch(data: any): any;
    init(): Promise<void>;
    get prefix(): any;
    get data(): DatastoreInterface;
    destroy(): Promise<void>;
}
