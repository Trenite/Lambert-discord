import { WebSocketShard as WSShard } from "discord.js";
export interface LambertWebSocketShard extends WSShard {
}
export declare class LambertWebSocketShard {
    sessionID: string;
    destroy(opts: any): void;
    private onPacket;
}
