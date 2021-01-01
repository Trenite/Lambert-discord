import { WebSocketManager, WebSocketOptions } from "discord.js";
import { LambertDiscordClient } from "./LambertDiscordClient";
declare module "discord.js" {
    interface WebSocketManager {
        destroy(keepalive?: number): void;
    }
}
export declare class LambertWebSocketManager extends WebSocketManager {
    constructor(client: LambertDiscordClient);
    private connect;
    private restoreStructure;
    private manageShard;
    protected createShards(): Promise<void>;
    protected destroy(keepalive?: boolean): void;
}
export interface LambertWebSocketOptions extends WebSocketOptions {
    sessionIDs?: string[];
    autoresume?: boolean;
}
