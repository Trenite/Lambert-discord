import { Collection, Connection } from "mongoose";
import { LambertDiscordClient } from "../client/LambertDiscordClient";
import { DatastoreProxyPath, Provider } from "../structures/Provider";
import { ProviderCache, ProviderCacheOptions } from "../structures/ProviderCache";
import { Database } from "./Database";
export declare class MongoDatabase implements Database<MongodbProvider> {
    private uri?;
    private mongod?;
    mongoConnection?: Connection;
    provider: typeof MongodbProvider;
    constructor(uri?: string | undefined);
    init(): Promise<void>;
    destroy(): Promise<void>;
}
export declare class MongodbProviderCache extends ProviderCache {
    provider: MongodbProvider;
    private changeStream;
    constructor(provider: MongodbProvider, opts: ProviderCacheOptions);
    init(): Promise<void>;
    update: (e: any) => void;
    destroy(): Promise<void>;
}
export declare class MongodbProvider implements Provider {
    private client;
    private path;
    collection: Collection;
    pipe: any[];
    document?: any;
    subpath?: string;
    updatepath?: string;
    options: any;
    arrayFilters: any[];
    get cache(): MongodbProviderCache;
    constructor(client: LambertDiscordClient, path: DatastoreProxyPath);
    convertFilterToQuery(obj: any): any;
    delete(): Promise<void> | Promise<boolean> | Promise<import("mongodb").DeleteWriteOpResultObject>;
    get(): Promise<any>;
    set(value: any): any;
    exists(): Promise<boolean>;
    checkIfModified(result: any): Promise<boolean>;
    push(element: any): any;
    pull(): Promise<boolean> | Promise<import("mongodb").DeleteWriteOpResultObject>;
    pop(): Promise<import("mongodb").DeleteWriteOpResultObject>;
    first(): Promise<any>;
    last(): Promise<any>;
    random(): Promise<any>;
    __getProvider(): this;
}
export declare function mongodb(db: Connection): Promise<[unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown]>;
//# sourceMappingURL=MongodbProvider.d.ts.map