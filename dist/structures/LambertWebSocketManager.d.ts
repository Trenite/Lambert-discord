import { WebSocketManager as WSManager, WebSocketOptions } from "discord.js";
declare module "discord.js" {
    interface WebSocketManager {
        destroy(keepalive?: number): void;
    }
}
export interface LambertWebSocketManager extends WSManager {
}
export declare class LambertWebSocketManager {
    private connect;
    private restoreStructure;
    private manageShard;
    protected createShards(): Promise<void>;
    protected destroy(keepalive?: boolean): void;
}
export interface LambertWebSocketOptions extends WebSocketOptions {
    sessionIDs?: string[];
    autoresume?: boolean;
    gatewayURL?: string;
}
