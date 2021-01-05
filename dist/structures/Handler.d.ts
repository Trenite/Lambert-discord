import { Collection } from "discord.js";
import { LambertDiscordClient } from "..";
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
export declare type HandlerOptions = {
    id: string;
    json?: boolean;
};
export declare class Handler<Holds extends Module> extends Module {
    readonly client?: LambertDiscordClient;
    readonly modules: Collection<string, Holds>;
    private loadJson;
    constructor({ id, json }: HandlerOptions);
    loadAll(dir: string): Promise<void>;
    load(path: string): Holds;
    register(mod: Holds): Promise<Holds>;
    reload(id: string): Promise<void>;
    getModule(id: string): Holds | undefined;
    reloadAll(): Promise<void>;
    remove(id: string): Promise<void>;
    removeAll(): Promise<void>;
    destroy(): Promise<void>;
}
