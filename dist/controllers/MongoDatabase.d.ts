import { Connection } from "mongoose";
import { LambertDiscordClient } from "..";
import { DatastoreProxyPath, Property } from "../structures/Datastore";
import { Database } from "./Database";
export declare class MongoDatabase implements Database<MongodbProperty> {
    private uri?;
    private mongod?;
    mongoConnection?: Connection;
    provider: typeof MongodbProperty;
    constructor(uri?: string | undefined);
    init(): Promise<void>;
    destroy(): Promise<void>;
}
export declare class MongodbProperty extends Property {
    private collection;
    private pipe;
    private document?;
    private subpath?;
    private updatepath?;
    private options;
    private arrayFilters;
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
}
export declare function mongodb(db: Connection): Promise<[unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown]>;
//# sourceMappingURL=MongoDatabase.d.ts.map