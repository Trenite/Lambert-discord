import { Client, ClientOptions, PresenceData } from "discord.js";
import { LambertWebSocketOptions, LambertWebSocketManager } from "./websocket/LambertWebSocketManager";
import { Database } from "../controllers/Database";
import { Provider } from "../structures/Provider";
import { LambertServer, LambertServerOptions } from "../api/LambertServer";
import { LambertDiscordClientEventLogger, LoggerCollection, LoggerOptions } from "../structures/Logger";
import { Registry } from "../structures/Registry";
declare global {
    namespace NodeJS {
        interface Global {
            client?: LambertDiscordClient;
        }
    }
}
export declare class LambertDiscordClient extends Client {
    options: LambertClientOptions;
    server: LambertServer;
    db: Database<Provider>;
    private dbSync;
    logger: LoggerCollection;
    eventLogger: LambertDiscordClientEventLogger;
    ws: LambertWebSocketManager;
    registry: Registry;
    constructor(options: LambertClientOptions);
    get data(): import("../structures/Provider").DatastoreType;
    init(): Promise<void>;
    login(token?: string): Promise<string>;
    shutdown: () => void;
    destroy(keepalive?: boolean, activity?: PresenceData): Promise<[any, void, void, void, [void, void, void, void]]>;
}
export interface LambertClientOptions extends ClientOptions {
    ws?: LambertWebSocketOptions;
    db?: Database<Provider>;
    server?: LambertServerOptions;
    logger?: LoggerOptions;
    commandPrefix: string;
}
//# sourceMappingURL=LambertDiscordClient.d.ts.map