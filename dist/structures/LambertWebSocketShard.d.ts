import { WebSocketShard } from "discord.js";
import { LambertWebSocketManager } from "./LambertWebSocketManager";
export declare class LambertWebSocketShard extends WebSocketShard {
    constructor(manager: LambertWebSocketManager, id: number);
    destroy(opts: any): void;
    private onPacket;
}
