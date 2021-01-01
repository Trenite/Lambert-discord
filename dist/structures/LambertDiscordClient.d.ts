import { Client, ClientOptions, PresenceData } from "discord.js";
import { LambertWebSocketOptions } from "./LambertWebSocketManager";
import { SyncDatabase } from "./SyncDatabase";
import { Database } from "lambert-db";
import { LambertServer, LambertServerOptions } from "../api/LambertServer";
import { ClientEventLogger, ClientEventLoggerOptions, WebhookLogger } from "./Logger";
import { Registry, RegistryOptions } from "./Registry";
import { CommandInteraction, CommandTrigger } from "./CommandInteraction";
export interface LambertClientOptions extends ClientOptions {
    ws?: LambertWebSocketOptions;
    application_id?: string;
    commandPrefix?: string;
    db?: Database;
    owner_ids?: string[];
    eventLogger?: ClientEventLoggerOptions;
    webhookLogger?: string;
    registry?: RegistryOptions;
    server?: LambertServerOptions;
    token: string;
}
declare module "discord.js" {
    interface Client {
        api: RouteBuilder;
        options: LambertClientOptions;
        server: LambertServer;
        db: Database;
        dbSync: SyncDatabase;
        eventLogger?: ClientEventLogger;
        webhookLogger?: WebhookLogger;
        registry: Registry;
        on(event: "interactionCreate", listener: (interaction: CommandInteraction) => void): this;
        on(event: "commandTriggered", listener: (trigger: CommandTrigger) => void): this;
    }
    interface BaseClient {
        api: RouteBuilder;
    }
    interface RouteBuilderMethodOptions {
        query?: any;
        versioned?: boolean;
        auth?: boolean;
        reason?: string;
        headers?: {
            [key: string]: string;
        };
        data?: any;
        files?: any;
    }
    interface RouteBuilderMethods {
        get(opts?: RouteBuilderMethodOptions): Promise<any>;
        post(opts?: RouteBuilderMethodOptions): Promise<any>;
        delete(opts?: RouteBuilderMethodOptions): Promise<any>;
        patch(opts?: RouteBuilderMethodOptions): Promise<any>;
        put(opts?: RouteBuilderMethodOptions): Promise<any>;
    }
    type RouteBuilderReturn = RouteBuilder & RouteBuilderMethods & {
        (...args: any[]): RouteBuilderReturn;
    };
    interface RouteBuilder {
        [key: string]: RouteBuilderReturn;
    }
}
export declare class LambertDiscordClient extends Client {
    initalized: Promise<any>;
    constructor(options: LambertClientOptions);
    get data(): import("lambert-db/dist/Datastore").DatastoreInterface;
    init(): Promise<void>;
    login(): Promise<string>;
    shutdown: () => void;
    destroy(keepalive?: boolean, activity?: PresenceData): Promise<[any, void, void, void, void, [void, void, void, void, void]]>;
}
declare global {
    namespace NodeJS {
        interface Global {
            client: LambertDiscordClient | undefined;
        }
    }
}
