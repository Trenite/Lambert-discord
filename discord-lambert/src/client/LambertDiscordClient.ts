require("../structures/LambertExtended");
import { Client, ClientOptions } from "discord.js";
import { LambertWebSocketOptions, LambertWebSocketManager } from "./websocket/LambertWebSocketManager";
import { Constants } from "../structures/Constants";
import { Registry } from "../structures/Registry";
import { SyncDatabase } from "../controllers/SyncDatabase";
const { Events } = Constants;
import { Database, MongoDatabase } from "../controllers/Database";
import { Property } from "../structures/Datastore";

export class LambertDiscordClient extends Client {
	public options: LambertClientOptions;
	public registry: Registry;
	public db: Database<Property>;
	private intialized: Promise<void>;
	private dbSync: SyncDatabase;

	constructor(options: LambertClientOptions) {
		super(options);
		// @ts-ignore

		this.ws = new LambertWebSocketManager(this);
		this.registry = new Registry(this);
		if (!this.options.db) this.db = new MongoDatabase();
		this.dbSync = new SyncDatabase(this);

		this.intialized = this.init();
	}

	async init() {
		this.emit(Events.DEBUG, "intializing Lambert client");
		await this.db.init();
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
}
