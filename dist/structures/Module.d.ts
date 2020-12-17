/// <reference types="node" />
import { EventEmitter } from "events";
import { Handler } from "./Handler";
export declare class Module extends EventEmitter {
    handler?: Handler<this>;
    filepath?: string;
    id: string;
    protected intialized: boolean;
    constructor(props: {
        id: string;
        filepath?: string;
    });
    init(): Promise<void>;
    getModule(id: string): Module | undefined;
    destroy(): Promise<void>;
    reload(id?: string): Promise<void | undefined>;
}
//# sourceMappingURL=Module.d.ts.map