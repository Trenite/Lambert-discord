import { Guild, User } from "discord.js";
import { Command } from "./Command";
import { LambertDiscordClient } from "./LambertDiscordClient";
import "missing-native-js-functions";
export interface Context {
    cmd?: Command;
    guild?: Guild;
    user?: User;
}
export declare type LEVELS = "fatal" | "error" | "warn" | "info" | "debug";
export declare abstract class Logger {
    static getColor(level: LEVELS): 1 | 16715520 | 16736000 | 16749568 | 28629;
    static getHexColor(level: LEVELS): string;
}
export declare function getLoggerLevelsAbove(level: LEVELS): LEVELS[];
export declare type ClientEventLoggerOptions = {
    level: LEVELS;
};
export declare class ClientEventLogger {
    private client;
    private options;
    private start;
    constructor(client: LambertDiscordClient, options: ClientEventLoggerOptions);
    init(): void;
    debug: (x: string) => void;
    error: (x: Error) => void;
    warn: (x: string) => void;
    info: (x: string) => void;
    invalidated: () => void;
    ready: () => void;
    destroy(): void;
}
export declare class WebhookLogger {
    private webhook;
    private lastMessage;
    constructor(webhook: string);
    init(): void;
    onLog: (old: any, chunk: any) => boolean;
    onError: (old: any, chunk: any) => boolean;
    destroy(): void;
    protected log(level: LEVELS, val: string): Promise<void>;
}
