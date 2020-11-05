// @ts-nocheck
import { Connection } from "mongoose";

export async function connection(db: Connection) {
	var collections = {};

	(await db.db.listCollections().toArray())
		.filter((c) => c.type === "collection")
		.forEach((c) => (collections[c.name] = c));

	await Promise.all([
		!collections.guilds && db.createCollection("guilds"),
		!collections.users && db.createCollection("users"),
	]);

	const guilds = await db.collection("guilds").getIndexes();
	const users = await db.collection("users").getIndexes();

	return Promise.all([
		!guilds.guildid && db.collection("guilds").createIndex({ id: 1 }, { unique: 1, name: "guildid", sparse: true }),
		!guilds.memberid &&
			db
				.collection("guilds")
				.createIndex({ "members.user.id": 1 }, { unique: 1, name: "memberid", sparse: true }),
		!users.userid && db.collection("users").createIndex({ id: 1 }, { unique: 1, name: "userid", sparse: true }),
	]);
}
