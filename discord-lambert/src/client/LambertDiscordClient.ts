require("../structures/LambertExtended");
import { Client, ClientOptions, PresenceData } from "discord.js";
import { LambertWebSocketOptions, LambertWebSocketManager } from "./websocket/LambertWebSocketManager";
import { Constants } from "../structures/Constants";
import { Registry } from "../structures/Registry";
import { SyncDatabase } from "../controllers/SyncDatabase";
const { Events } = Constants;
import { Database } from "../controllers/Database";
import { Property, Datastore } from "../structures/Datastore";
import { LambertServer, LambertServerOptions } from "../api/LambertServer";
import { MongoDatabase } from "../controllers/MongoDatabase";

export class LambertDiscordClient extends Client {
	public options: LambertClientOptions;
	public server: LambertServer;
	public registry: Registry;
	public db: Database<Property>;
	public intialized: Promise<void>;
	private dbSync: SyncDatabase;
	public ws: LambertWebSocketManager;

	constructor(options: LambertClientOptions) {
		super(options);

		this.ws = new LambertWebSocketManager(this);
		this.registry = new Registry(this);
		this.server = new LambertServer(this, options.server);

		if (!this.options.db) this.db = new MongoDatabase();
		else this.db = this.options.db;

		this.dbSync = new SyncDatabase(this);

		this.intialized = this.init();
		process.on("SIGINT", this.shutdown);
	}

	public get data() {
		return Datastore(this);
	}

	async init() {
		this.emit(Events.DEBUG, "intializing Lambert client");
		await Promise.all([this.db.init(), this.server.init()]);

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
		await this.intialized;
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

		// return Promise.all([this.db.destroy(), this.dbSync.destroy()]);
	}
}

export interface LambertClientOptions extends ClientOptions {
	ws?: LambertWebSocketOptions;
	db?: Database<Property>;
	server?: LambertServerOptions;
}

process.on("uncaughtException", criticalError);
process.on("unhandledRejection", criticalError);

function criticalError(error: Error) {
	console.error(
		`
UNCAUGHT EXCEPTION
There was a critical exception, however Lambert catched it.
Please catch this error the next time:
`,
		error
	);
}
