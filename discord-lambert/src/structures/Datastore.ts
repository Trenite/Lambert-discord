import { Collection, Connection } from "mongoose";
import { FindAndModifyWriteOpResultObject, DeleteWriteOpResultObject } from "mongodb";
import { LambertDiscordClient } from "../client/LambertDiscordClient";
import { MongoDatabase } from "../controllers/MongoDatabase";

declare global {
	interface Array<T> {
		last(): T;
	}
}

Array.prototype.last = function () {
	return this[this.length - 1];
};

/**
 *
 * ┌─────────┐
 * │Datastore│
 * └─────────┘
 *
 * @example:

 * guild.data.xp-enabled.get()
 *
 * @returns {Promise}
 *
 * @template Actions:
 * - delete() - deletes the property
 * - get() - gets the value of the property
 * - exists() - check if the property exists
 * - set(value) - sets the value for the property
 * - push(value) - inserts the value in the array
 * - every(fn) - check if every element fulfills the function
 * - some(fn) - check if any element fulfills the function
 * - first() - gets the first element of the array
 * - last() - get the last element of the array
 * - random() - gets a random element of the array
 * - TODO concat(arr) - combines database with this array
 *
 * @variation Identifier:
 * - value
 * - {id}
 * - function (warning much overhead)
 * - native mongodb cmds: $gt $lt $eq $ne
 *
 * 
 * db.guilds.aggregate([{$match: {id:"561235799233003551"}}, {$unwind: "$members"},{$replaceRoot: {newRoot: "$members"}}, {$match: {"id":"311129357362135041"}}])
 * db.guilds.aggregate([{$match: {id:"561235799233003551"}}, {$unwind: "$members"},{$replaceRoot: {newRoot: "$members"}}, {$match: {"id":"311129357362135041"}}, {$project: {"joined_at": "$joined_at"}}])
 * 
 * db.guilds.aggregate([{$match: {id:"561235799233003551"}}, {$project: {"name": "$name"}}])
 *
 * db.guilds.updateOne({}, [{$match: {id:"561235799233003551"}}, {$unwind: "$members"},{$replaceRoot: {newRoot: "$members"}}, {$match: {"id":"311129357362135041"}}, {$set: {"nick": "test"}}])
 * 
 */

/** example PATH:
 * user
 * users
 * users({id: 311129357362135041})
 * guilds
 * guilds({id: 769302137364283432})
 * guilds({id: 769302137364283432}).xp-system
 * guilds({id: 769302137364283432}).xp-system.enabled
 * guilds({id: 769302137364283432}).members({id: 311129357362135041}.data.rank
 * -> {$and: [{id: "769302137364283432"}, members: {}]
 *
 * db.collection("guilds").deleteOne({id: "769302137364283432"})
 *
 */

export class Property {
	constructor(protected client: LambertDiscordClient, protected path: DatastoreProxyPath) {
		if (!path.length) throw new TypeError("path must be at least contain one element");
	}

	delete() {}
	set(value: any) {}
	get() {}
	exists() {}
	push(value: any) {}
	first() {}
	last() {}
	random() {}
}

const noop = () => {};
const methods = Object.getOwnPropertyNames(Property.prototype).slice(1);
const reflectors = [
	"toString",
	"valueOf",
	"inspect",
	"constructor",
	Symbol.toPrimitive,
	Symbol.for("nodejs.util.inspect.custom"),
];

export type DatastoreProxyPath = { name: string; filter?: any }[];

export function Datastore(client: LambertDiscordClient, path: DatastoreProxyPath = []) {
	var method: string;

	const handler = {
		get(target: Function, name: string): WindowProxy | Function {
			if (reflectors.includes(name)) return () => path.join("."); // debugger is requesting prop -> don't add to path
			if (methods.includes(name)) {
				// check if method is called e.g. get()
				method = name;
			} else {
				path.push({ name, filter: null }); // add to the path -> name of the prop, unique id to add it mongo arrayFilters
			}
			return new Proxy(noop, handler);
		},
		apply(_: any, self: any, args: any[]): WindowProxy | Promise<any> {
			var arg = args[0];

			if (methods.includes(method)) {
				// @ts-ignore

				return new client.db.provider(client, path)[method](arg); // actually run the query
			}

			path[path.length - 1].filter = arg;

			return new Proxy(noop, handler);
		},
	};
	return new Proxy(noop, handler);
}
