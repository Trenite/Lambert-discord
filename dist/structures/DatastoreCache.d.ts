import { Property } from "./Datastore";
export declare type DatastoreCacheOptions = {};
export declare class DatastoreCache {
    private property;
    private opts;
    private cache;
    private timeout;
    constructor(property: Property, opts: DatastoreCacheOptions);
    init(): void;
    delete(): void;
    set(value: any): void;
    get(): any;
    exists(): void;
    push(value: any): void;
    first(): void;
    last(): void;
    random(): void;
    destroy(): void;
}
//# sourceMappingURL=DatastoreCache.d.ts.map