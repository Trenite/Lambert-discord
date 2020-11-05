import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose, { Connection } from "mongoose";
import { MongodbProperty, Property } from "../structures/Datastore";

export type Constructable<T> = new (...args: any[]) => T;

export interface Database<P extends Property> {
	provider: Constructable<P>;

	init(): Promise<any>;
	close(): any;
}

export class MongoDatabase implements Database<MongodbProperty> {
	private mongod?: MongoMemoryServer;
	public mongoConnection?: Connection;
	public provider = MongodbProperty;

	constructor(private uri?: string) {}

	async init() {
		if (!this.uri) {
			this.mongod = require("../controllers/Mongod").default;
			this.uri = await this.mongod?.getUri();
		}
		this.mongoConnection = await mongoose.createConnection(<string>this.uri, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
	}

	async close() {
		await Promise.all([this.mongoConnection?.close(), this.mongod?.stop()]);
	}
}
