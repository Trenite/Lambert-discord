require("../structures/LambertExtended");
import { Client, ClientOptions } from "discord.js";
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

	constructor(options: LambertClientOptions) {
		super(options);
		// @ts-ignore

		this.ws = new LambertWebSocketManager(this);
		this.registry = new Registry(this);
		this.server = new LambertServer(this, options.server);

		if (!this.options.db) this.db = new MongoDatabase();
		else this.db = this.options.db;

		this.dbSync = new SyncDatabase(this);

		this.intialized = this.init();
	}

	public get data() {
		return Datastore(this);
	}

	async init() {
		this.emit(Events.DEBUG, "intializing Lambert client");
		await Promise.all([this.db.init(), this.server.init()]);

		// const shards = (await this.data.shards.get()) || [];
		// var sessionIDs: any = {};
		// shards.forEach((shard: any) => (sessionIDs[shard.id] = shard.sessionID));

		// if (!this.options.ws) this.options.ws = {};
		// this.options.ws.sessionIDs = sessionIDs;

		this.emit(Events.CLIENT_INIT);
	}

	async login(token?: string) {
		await this.intialized;
		return super.login(token);
	}

	async destroy() {
		super.destroy();
		return this.db.close();
	}
}

export interface LambertClientOptions extends ClientOptions {
	ws?: LambertWebSocketOptions;
	db?: Database<Property>;
	server?: LambertServerOptions;
}
