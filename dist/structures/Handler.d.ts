import { Collection } from "discord.js";
import { Module } from "./Module";
export declare const HandlerEvents: {
    LOAD: string;
    LOADALL: string;
    REGISTER: string;
    RELOAD: string;
    RELOADALL: string;
    REMOVE: string;
    REMOVEALL: string;
    ERROR: string;
};
export declare class Handler<Holds extends Module> extends Module {
    readonly modules: Collection<string, Module | Handler<Holds>>;
    constructor(id: string);
    init(): Promise<any>;
    loadAll(dir: string): Promise<void>;
    load(path: string): Module;
    register(mod: Module): Promise<void>;
    reload(id: string): Promise<void>;
    getModule(id: string): Module | undefined;
    reloadAll(): Promise<void>;
    remove(id: string): Promise<void>;
    removeAll(): Promise<void>;
    destroy(): Promise<void>;
}
//# sourceMappingURL=Handler.d.ts.map