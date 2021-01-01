"use strict";
// import { Connection } from "mongoose";
// export async function mongodb(db: Connection) {
// 	var collections = {};
// 	(await db.db.listCollections().toArray())
// 		.filter((c) => c.type === "collection") // @ts-ignore
// 		.forEach((c) => (collections[c.name] = c));
// 	// @ts-ignore
// 	await Promise.all([
// 		// @ts-ignore
// 		!collections.guilds && db.createCollection("guilds"), // @ts-ignore
// 		!collections.users && db.createCollection("users"), // @ts-ignore
// 		!collections.user && db.createCollection("user"), // @ts-ignore
// 		!collections.shards && db.createCollection("shards"),
// 	]);
// 	const guilds = await db.collection("guilds").getIndexes();
// 	const users = await db.collection("users").getIndexes();
// 	const user = await db.collection("user").getIndexes();
// 	const shards = await db.collection("shards").getIndexes();
// 	const NumberLong = (t: any) => 0; // placeholder, mongodb has internal NumberLong -> prevent not found error
// 	// @ts-ignore
// 	return Promise.all([
// 		db.collection("system").insertOne({
// 			_id: "getShardId",
// 			value: function (guild_id: number, num_shards: number) {
// 				return (NumberLong(guild_id) >> 22) & num_shards;
// 			},
// 		}),
// 		// @ts-ignore
// 		!guilds.clientid && db.collection("user").createIndex({ id: 1 }, { unique: 1, name: "clientid" }),
// 		// @ts-ignore
// 		!guilds.guildid && db.collection("guilds").createIndex({ id: 1 }, { unique: 1, name: "guildid" }), // @ts-ignore
// 		!guilds.memberid && // @ts-ignore
// 			db
// 				.collection("guilds")
// 				.createIndex({ "members.user.id": 1 }, { unique: 1, name: "memberid", sparse: true }), // @ts-ignore
// 		!users.userid && db.collection("users").createIndex({ id: 1 }, { unique: 1, name: "userid" }), // @ts-ignore
// 		!user.userid && db.collection("user").createIndex({ id: 1 }, { unique: 1, name: "userid" }), // @ts-ignore
// 		!shards.shardid && db.collection("shards").createIndex({ id: 1 }, { unique: 1, name: "shardid" }),
// 	]);
// }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdHJ1Y3R1cmVzL3Rlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHlDQUF5QztBQUV6QyxrREFBa0Q7QUFDbEQseUJBQXlCO0FBRXpCLDZDQUE2QztBQUM3QywwREFBMEQ7QUFDMUQsZ0RBQWdEO0FBRWhELGlCQUFpQjtBQUNqQix1QkFBdUI7QUFDdkIsa0JBQWtCO0FBQ2xCLHdFQUF3RTtBQUN4RSxzRUFBc0U7QUFDdEUsb0VBQW9FO0FBQ3BFLDBEQUEwRDtBQUMxRCxPQUFPO0FBRVAsOERBQThEO0FBQzlELDREQUE0RDtBQUM1RCwwREFBMEQ7QUFDMUQsOERBQThEO0FBQzlELGdIQUFnSDtBQUVoSCxpQkFBaUI7QUFDakIsd0JBQXdCO0FBQ3hCLHdDQUF3QztBQUN4Qyx3QkFBd0I7QUFDeEIsOERBQThEO0FBQzlELHdEQUF3RDtBQUN4RCxRQUFRO0FBQ1IsUUFBUTtBQUNSLGtCQUFrQjtBQUNsQix1R0FBdUc7QUFDdkcsa0JBQWtCO0FBQ2xCLHFIQUFxSDtBQUNySCxzQ0FBc0M7QUFDdEMsUUFBUTtBQUNSLDRCQUE0QjtBQUM1QiwyR0FBMkc7QUFDM0csaUhBQWlIO0FBQ2pILCtHQUErRztBQUMvRyx1R0FBdUc7QUFDdkcsT0FBTztBQUNQLElBQUkifQ==