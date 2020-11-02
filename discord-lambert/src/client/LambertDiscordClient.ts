import { Client, ClientOptions, Collection } from "discord.js";
import { Command } from "../structures/Command";
import { LambertWebSocketOptions, LambertWebSocketManager } from "./websocket/LambertWebSocketManager";
import mongoose, { Connection } from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Constants } from "../structures/Constants";
import { Registry } from "../structures/Registry";
import { SyncDatabase } from "../controllers/SyncDatabase";
const { Events } = Constants;

export class LambertDiscordClient extends Client {
	public options: LambertClientOptions;
	public registry: Registry;
	public dbConnection: Connection;
	private mongod?: MongoMemoryServer;
	private intialized: Promise<void>;
	private dbSync: SyncDatabase;

	constructor(options: LambertClientOptions) {
		super(options);
		// @ts-ignore

		this.ws = new LambertWebSocketManager(this);
		this.registry = new Registry(this);
		this.dbSync = new SyncDatabase(this);

		this.intialized = this.init();
	}

	async init() {
		this.emit(Events.DEBUG, "intializing Lambert client");
		// use promise all to intialize
		await Promise.all([
			(async () => {
				var dbConnectionUri = this.options.mongodb;
				if (!this.options.mongodb) {
					this.mongod = require("../controllers/Mongod").default;
					dbConnectionUri = await this.mongod?.getUri();
				}
				this.dbConnection = await mongoose.createConnection(<string>dbConnectionUri, {
					useNewUrlParser: true,
					useUnifiedTopology: true,
				});
			})(),
		]);
		this.emit(Events.DEBUG, "intialized Lambert client");
		this.emit(Events.CLIENT_INIT);
	}

	async login(token?: string) {
		await this.intialized;
		return super.login(token);
	}

	async destroy() {
		super.destroy();
		this.dbConnection.close();
		await this.mongod?.stop();
	}
}

export interface LambertClientOptions extends ClientOptions {
	ws?: LambertWebSocketOptions;
	mongodb?: string;
}
