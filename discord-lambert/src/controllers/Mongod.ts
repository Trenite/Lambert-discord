import { MongoMemoryServer } from "mongodb-memory-server";
import fs from "fs";

const dbPath = `${__dirname}/../../database/`;

if (!fs.existsSync(dbPath)) fs.mkdirSync(dbPath);

const mongod = new MongoMemoryServer({
	instance: {
		dbName: "lambert",
		dbPath,
		storageEngine: "wiredTiger",
		auth: true,
		args: [],
	},
	autoStart: true,
});

export default mongod;
