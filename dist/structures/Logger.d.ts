import { Guild, User } from "discord.js";
import { Command } from "./Command";
import { LambertDiscordClient } from "../client/LambertDiscordClient";
export interface Context {
    cmd?: Command;
    guild?: Guild;
    user?: User;
}
export declare type LEVELS = "fatal" | "error" | "warn" | "info" | "debug";
export declare abstract class Logger {
    fatal(val: string, ctx?: Context): string;
    error(val: string, ctx?: Context): string;
    warn(val: string, ctx?: Context): string;
    info(val: string, ctx?: Context): string;
    debug(val: string, ctx?: Context): string;
    protected log(level: string, val: string, ctx?: Context): string;
    static getColor(level: LEVELS): 1 | 16715520 | 16736000 | 16749568 | 28629;
    static getHexColor(level: LEVELS): string;
}
export declare type LoggerOptions = {
    loggers?: Logger[];
    level?: LEVELS;
};
export declare class LoggerCollection extends Logger {
    private opts;
    loggers: Logger[];
    constructor(opts?: LoggerOptions);
    protected log(level: LEVELS, val: string, ctx?: Context): string;
    add(logger: Logger): void;
    remove(logger: Logger): void;
}
export declare class LambertDiscordClientEventLogger {
    private client;
    private start;
    constructor(client: LambertDiscordClient);
    init(): void;
    debug: (x: string) => void;
    error: (x: Error) => void;
    warn: (x: string) => void;
    info: (x: string) => void;
    invalidated: () => void;
    ready: () => void;
    destroy(): void;
}
export declare type WebhookLoggerOptions = {
    loggers: {
        fatal?: string;
        error?: string;
        warn?: string;
        debug?: string;
        info?: string;
    };
    level: LEVELS;
};
export declare function getLoggerLevelsAbove(level: LEVELS): LEVELS[];
export declare class WebhookLogger extends Logger {
    private webhooks;
    private lastMessage;
    private level;
    constructor(opts: WebhookLoggerOptions);
    protected log(level: LEVELS, val: string, ctx?: Context): string;
}
export declare class ChalkLogger extends Logger {
    private level;
    private signale;
    constructor(level?: LEVELS);
    log(level: LEVELS, val: string, ctx?: Context): string;
}
//# sourceMappingURL=Logger.d.ts.map