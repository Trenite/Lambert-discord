require("../structures/LambertExtended");
import { Client, ClientOptions, PresenceData } from "discord.js";
import { LambertWebSocketOptions, LambertWebSocketManager } from "./websocket/LambertWebSocketManager";
import { Constants } from "../structures/Constants";
import { SyncDatabase } from "../controllers/SyncDatabase";
const { Events } = Constants;
import { Database } from "../controllers/Database";
import { Provider, Datastore } from "../structures/Provider";
import { LambertServer, LambertServerOptions } from "../api/LambertServer";
import { MongoDatabase } from "../controllers/MongodbProvider";
import { LambertDiscordClientEventLogger, LoggerCollection, LoggerOptions } from "../structures/Logger";
import { Registry } from "../structures/Registry";

declare global {
	namespace NodeJS {
		interface Global {
			client?: LambertDiscordClient;
		}
	}
}

export class LambertDiscordClient extends Client {
	public options: LambertClientOptions;
	public server: LambertServer;
	public db: Database<Provider>;
	private dbSync: SyncDatabase;
	public logger: LoggerCollection;
	public eventLogger: LambertDiscordClientEventLogger;
	public ws: LambertWebSocketManager;
	public registry: Registry;

	constructor(options: LambertClientOptions) {
		super(options);

		this.ws = new LambertWebSocketManager(this);
		this.server = new LambertServer(this, options.server);
		this.logger = new LoggerCollection(options.logger);
		this.eventLogger = new LambertDiscordClientEventLogger(this);

		if (!this.options.db) this.db = new MongoDatabase();
		else this.db = this.options.db;

		this.dbSync = new SyncDatabase(this);

		process.on("SIGINT", this.shutdown);
		global.client = this;
	}

	public get data() {
		return Datastore(this);
	}

	async init() {
		this.emit(Events.DEBUG, "intializing Lambert client");
		await Promise.all([
			this.db.init(),
			this.dbSync.init(),
			this.server.init(),
			this.eventLogger.init(),
			this.registry.init(),
		]);

		if (this.options.ws?.autoresume) {
			const shards = (await this.data.shards.get()) || [];
			var sessionIDs: any = {};
			shards.forEach((shard: any) => (sessionIDs[shard.id] = shard.sessionID));

			if (!this.options.ws) this.options.ws = {};
			this.options.ws.sessionIDs = sessionIDs;
		}

		this.emit(Events.CLIENT_INIT);
	}

	async login(token?: string) {
		await this.init();
		return super.login(token);
	}

	shutdown = () => {
		setTimeout(() => {
			process.exit(1);
		}, 1000 * 4);
		this.destroy().finally(() => process.exit());
	};

	async destroy(keepalive: boolean = true, activity?: PresenceData) {
		process.off("SIGINT", this.shutdown);
		if (keepalive) {
			await this.user?.setPresence(activity || { status: "dnd", activity: { name: "stopped" } }).catch(() => {});
		}
		this.ws.destroy(keepalive);
		super.destroy();

		return Promise.all([
			this.db.destroy(),
			this.dbSync.destroy(),
			this.server.destroy(),
			this.eventLogger.destroy(),
			this.registry.destroy(),
		]);
	}
}

export interface LambertClientOptions extends ClientOptions {
	ws?: LambertWebSocketOptions;
	db?: Database<Provider>;
	server?: LambertServerOptions;
	logger?: LoggerOptions;
	commandPrefix: string;
}

process.on("uncaughtException", criticalError);
process.on("unhandledRejection", criticalError);

function criticalError(error: Error) {
	let text = `
UNCAUGHT EXCEPTION
There was a critical exception, however Lambert catched it.
Please catch this error the next time:\n${error.stack}
`;
	if (global.client) global.client.logger.fatal(text);
	else console.error(text);
}
