/// <reference types="node" />
import { Collection } from "discord.js";
import { EventEmitter } from "events";
import { Handler } from "./Handler";
import { Module } from "./Module";
export declare class InhibitorHandler extends Handler<Inhibitor> {
    readonly emitter: EventEmitter;
    readonly modules: Collection<string, Inhibitor | InhibitorHandler>;
    private readonly passthrough;
    constructor(emitter: EventEmitter);
    onEmit(event: string, ...args: any[]): Promise<boolean>;
    test(event: string, ...args: any[]): Promise<boolean>;
}
export interface Inhibitor extends Module {
    test(event: string, ...args: any[]): Promise<boolean> | boolean;
}
//# sourceMappingURL=Inhibitor.d.ts.map