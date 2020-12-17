import { WebSocketManager, WebSocketOptions, Collection } from "discord.js";
import { LambertDiscordClient } from "../LambertDiscordClient";
import { LambertWebSocketShard } from "./LambertWebSocketShard";
export declare class LambertWebSocketManager extends WebSocketManager {
    readonly client: LambertDiscordClient;
    shards: Collection<number, LambertWebSocketShard>;
    shardQueue: Set<LambertWebSocketShard>;
    constructor(client: LambertDiscordClient);
    protected connect(): Promise<void>;
    private restoreStructure;
    private manageShard;
    protected createShards(): Promise<Boolean>;
    destroy(keepalive?: boolean): void;
}
export interface LambertWebSocketOptions extends WebSocketOptions {
    sessionIDs?: string[];
    autoresume?: boolean;
}
//# sourceMappingURL=LambertWebSocketManager.d.ts.map