import { WebSocketShard } from "discord.js";
import { LambertWebSocketManager } from "./LambertWebSocketManager";
export declare class LambertWebSocketShard extends WebSocketShard {
    manager: LambertWebSocketManager;
    constructor(manager: LambertWebSocketManager, id: number);
    destroy(opts: any): void;
    onPacket(packet: any): void;
}
//# sourceMappingURL=LambertWebSocketShard.d.ts.map