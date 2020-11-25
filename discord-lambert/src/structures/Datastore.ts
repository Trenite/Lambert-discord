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

function decycle(obj: any, stack = []): any {
	if (!obj || typeof obj !== "object") return obj;

	// @ts-ignore
	if (stack.includes(obj)) return null;
	// @ts-ignore
	let s = stack.concat([obj]);

	return Array.isArray(obj)
		? obj.map((x) => decycle(x, s))
		: // @ts-ignore
		  Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, decycle(v, s)]));
}

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

export class MongodbProperty extends Property {
	private collection: Collection;
	private pipe: any[];
	private document?: any;
	private subpath?: string;
	private updatepath?: string;
	private options: any = {};
	private arrayFilters: any[] = [];

	constructor(client: LambertDiscordClient, path: DatastoreProxyPath) {
		super(client, path);
		const collection = path[0];
		this.path = path.slice(1);
		path = this.path;

		this.path.forEach((entry) => {
			if (!entry.filter) return;
			if (typeof entry.filter == "function") entry.filter = { $where: entry.filter }; // run js on mongodb: https://docs.mongodb.com/manual/reference/operator/query/where/
			// if (typeof entry.filter == "object") entry.filter = { $elemMatch: entry.filter }; // $elemMatch https://docs.mongodb.com/manual/reference/operator/query/elemMatch/
		});
		const db = <MongoDatabase>this.client.db;
		if (!db.mongoConnection) throw new Error("Database not connected");

		this.collection = db.mongoConnection.collection(collection.name);

		if (collection.filter) {
			var pipe: any[] = [];
			var arrayFilters: any[] = [];
			var up: string[] = [];
			var i = 0;

			pipe.push({ $match: collection.filter });

			this.path.forEach((x, i) => {
				if (!x.filter) {
					up.push(x.name);
					if (!pipe.last()["$project"]) return pipe.push({ $project: { [x.name]: "$" + x.name } });

					var projection = pipe.last()["$project"];
					var key = Object.keys(projection)[0];
					projection[key] += "." + x.name;
					return;
				}

				var id = x.name + i++;

				up.push(x.name, `$[${id}]`);
				arrayFilters.push(this.convertFilterToQuery({ [id]: x.filter }));

				pipe.push({ $unwind: "$" + x.name }, { $replaceRoot: { newRoot: "$" + x.name } }, { $match: x.filter });
			});

			this.pipe = pipe;
			this.subpath = path.length ? path.map((x) => x.name).join(".") : undefined;
			this.document = collection.filter;
			this.updatepath = up.length ? up.join(".") : undefined;
			this.arrayFilters = arrayFilters;
		}

		this.options.upsert = true;
	}

	convertFilterToQuery(obj: any) {
		var walked = [];
		var res: any = {};
		var stack: any = [{ obj: obj, stack: "" }];
		while (stack.length > 0) {
			var item = stack.pop();
			var obj = item.obj;
			for (var property in obj) {
				if (obj.hasOwnProperty(property)) {
					if (typeof obj[property] == "object") {
						var alreadyFound = false;
						for (var i = 0; i < walked.length; i++) {
							if (walked[i] === obj[property]) {
								alreadyFound = true;
								break;
							}
						}
						if (!alreadyFound) {
							walked.push(obj[property]);
							stack.push({ obj: obj[property], stack: item.stack + "." + property });
						}
					} else {
						var id = (item.stack + ".").slice(1);
						res[id + property] = obj[property];
					}
				}
			}
		}
		return res;
	}

	delete() {
		if (this.updatepath) {
			return this.checkIfModified(
				this.collection.updateOne(
					this.document,
					{ $unset: { [this.updatepath]: "" } },
					{ ...this.options, arrayFilters: this.arrayFilters }
				)
			);
		}
		if (this.document) return this.collection.deleteOne(this.document);

		return this.collection.conn.dropCollection(this.collection.name);
	}

	async get() {
		if (this.pipe) {
			var lastProp = Object.keys(this.pipe.last()["$project"])[0];
			if (this.pipe.last()["$match"]) this.pipe.push({ $project: { [lastProp]: "$$ROOT" } }); // used to get properly get the element if last pipe operator was an array filter
			var result = await this.collection.aggregate(this.pipe).toArray();
			return result && result.length ? result[0][lastProp] : undefined;
		}

		return this.collection.find({}).toArray();
	}

	set(value: any): any {
		value = decycle(value);
		if (this.updatepath) {
			return this.checkIfModified(
				this.collection.updateOne(
					this.document,
					{ $set: { [this.updatepath]: value } },
					{ ...this.options, arrayFilters: this.arrayFilters }
				)
			);
		}

		// set collection -> insert all elements
		if (Array.isArray(value)) {
			// do not use insertmany -> fails if already exists
			var operations = value.map((x) => {
				return {
					updateOne: {
						filter: { id: x.id },
						update: {
							$set: x,
						},
						upsert: true,
					},
				};
			});
			return this.collection.bulkWrite(operations, {
				ordered: false,
			});
		} else {
			if (this.document) {
				return this.checkIfModified(this.collection.updateOne(this.document, { $set: value }, this.options));
			}
			return this.collection.insertOne(value);
		}
	}

	async exists() {
		// TODO make it efficient and do not fetch it
		return !!(await this.get());
	}

	async checkIfModified(result: any) {
		result = await result;
		return result.modifiedCount > 0;
	}

	push(element: any) {
		if (this.updatepath) {
			return this.checkIfModified(
				this.collection.updateOne(
					this.document,
					{ $push: { [this.updatepath]: element } },
					{ ...this.options, arrayFilters: this.arrayFilters }
				)
			);
		}

		return this.set(element);
	}

	pull() {
		if (this.subpath) {
			var { filter } = this.path.last();
			if (!filter) throw "the last property must specify a filter";
			return this.checkIfModified(
				this.collection.updateOne(this.document, { $pull: { [this.subpath]: filter } }, this.options)
			);
		}

		return this.pop();
	}

	pop() {
		// TODO
		return this.collection.deleteOne({});
	}

	async first() {
		if (this.subpath) {
			var { name } = this.path.last();

			var result = await this.collection
				.aggregate([
					...this.pipe,
					{ $unwind: "$" + name },
					{ $replaceRoot: { newRoot: "$" + name } },
					{ $limit: 1 },
				])
				.toArray();
			return result && result.length ? result[0] : undefined;
		}

		return this.collection.findOne({}, { sort: { $natural: 1 } });
	}

	last() {
		if (this.subpath) {
			// TODO
			return this.collection.findOne(this.document);
		}

		return this.collection.findOne({}, { sort: { $natural: -1 } });
	}

	async random() {
		if (this.subpath) {
			var { name } = this.path.last();

			var result = await this.collection
				.aggregate([
					...this.pipe,
					{ $unwind: "$" + name },
					{ $replaceRoot: { newRoot: "$" + name } },
					{ $sample: { size: 1 } },
				])
				.toArray();
			return result && result.length ? result[0] : undefined;
		}

		return this.collection.aggregate([{ $sample: { size: 1 } }]);
	}
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
