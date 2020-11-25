import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose, { Connection } from "mongoose";
import { MongodbProperty, Property } from "../structures/Datastore";
import { Database } from "./Database";

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
		const { mongodb } = require("../models/init");
		await mongodb(this.mongoConnection);
	}

	async close() {
		await Promise.all([this.mongoConnection?.close(), this.mongod?.stop()]);
	}
}

export async function mongodb(db: Connection) {
	var collections = {};

	(await db.db.listCollections().toArray())
		.filter((c) => c.type === "collection") // @ts-ignore
		.forEach((c) => (collections[c.name] = c));

	// @ts-ignore
	await Promise.all([
		// @ts-ignore
		!collections.guilds && db.createCollection("guilds"), // @ts-ignore
		!collections.users && db.createCollection("users"), // @ts-ignore
		!collections.user && db.createCollection("user"), // @ts-ignore
		!collections.shards && db.createCollection("shards"),
	]);

	const guilds = await db.collection("guilds").getIndexes();
	const users = await db.collection("users").getIndexes();
	const user = await db.collection("user").getIndexes();
	const shards = await db.collection("shards").getIndexes();

	// @ts-ignore
	return Promise.all([
		// @ts-ignore
		!guilds.clientid && db.collection("user").createIndex({ id: 1 }, { unique: 1, name: "clientid" }), // @ts-ignore
		!guilds.guildid && db.collection("guilds").createIndex({ id: 1 }, { unique: 1, name: "guildid" }), // @ts-ignore
		!guilds.memberid && // @ts-ignore
			db
				.collection("guilds")
				.createIndex({ "members.user.id": 1 }, { unique: 1, name: "memberid", sparse: true }), // @ts-ignore
		!users.userid && db.collection("users").createIndex({ id: 1 }, { unique: 1, name: "userid" }), // @ts-ignore
		!shards.shardid && db.collection("shards").createIndex({ id: 1 }, { unique: 1, name: "shardid" }),
	]);
}
