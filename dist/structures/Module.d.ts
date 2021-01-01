/// <reference types="node" />
import { EventEmitter } from "events";
import { Handler } from "./Handler";
export declare type ModuleOptions = {
    id: string;
    filepath?: string;
};
export declare class Module extends EventEmitter {
    handler?: Handler<this>;
    filepath?: string;
    id: string;
    protected intialized: boolean;
    constructor(props: ModuleOptions);
    init(): Promise<void>;
    getModule(id: string): Module | undefined;
    destroy(): Promise<void>;
    reload(id?: string): Promise<void>;
}
