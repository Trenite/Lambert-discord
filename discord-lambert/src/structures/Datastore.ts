import { Collection, Connection } from "mongoose";
import { FindAndModifyWriteOpResultObject, DeleteWriteOpResultObject } from "mongodb";
import { LambertDiscordClient } from "../client/LambertDiscordClient";
import { MongoDatabase } from "../controllers/Database";

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

type DeleteOpResult =
	| Promise<DeleteWriteOpResultObject | FindAndModifyWriteOpResultObject<any>>
	| Promise<FindAndModifyWriteOpResultObject<any>>
	| Promise<void>;

export class Property {
	constructor(protected client: LambertDiscordClient, protected path: DatastoreProxyPath) {
		if (!path.length) throw new TypeError("path must be at least contain one element");
	}

	delete() {}
	remove() {} // same as delete
	set(value: any) {}
	get() {}
	exists() {}
	push(value: any) {}
	insert(value: any) {} // same as push
	first() {}
	last() {}
	random() {}
}

export class MongodbProperty extends Property {
	private collection: Collection;
	private document: any;
	private options = {
		upsert: true,
	};
	private subpath?: string;
	private updatepath?: string;
	private arrayFilters: any[] = [];

	constructor(client: LambertDiscordClient, path: DatastoreProxyPath) {
		super(client, path);
		const collection = path[0];
		this.path = path.slice(1);
		path = this.path;

		this.path.forEach((entry) => {
			if (!entry.filter) return;
			if (typeof entry.filter == "function") entry.filter = { $where: entry.filter }; // run js on mongodb: https://docs.mongodb.com/manual/reference/operator/query/where/
		});
		const db = <MongoDatabase>this.client.db;
		if (!db.mongoConnection) throw new Error("Database not connected");

		this.collection = db.mongoConnection.collection(collection.name);
		if (collection.filter) {
			var subpathFilter: any = {};
			var up: any[] = [];

			this.path.forEach((x, i) => {
				up.push(x.name);
				if (!x.filter) return;
				var p = this.path
					.slice(0, i + 1)
					.map((x) => x.name)
					.join(".");
				var id = x.name + up.length;
				up.push(`$[${id}]`);

				this.arrayFilters.push(this.convertFilterToQuery({ [id]: x.filter }));
				if (typeof x.filter === "object") x.filter = this.convertFilterToQuery({ [p]: x.filter });
				subpathFilter = { ...subpathFilter, ...x.filter };
			});

			this.updatepath = up.join(".");

			this.document = { ...collection.filter, ...subpathFilter };
		}

		this.subpath = this.path.length ? this.path.map((x) => x.name).join(".") : undefined;
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

	delete(): DeleteOpResult {
		if (this.subpath) {
			// @ts-ignore
			return this.collection.findOneAndUpdate(
				this.document,
				{ $unset: { [<string>this.subpath]: "" } },
				this.options
			);
		}
		if (this.document) return this.collection.deleteOne(this.document);

		return this.collection.conn.dropCollection(this.collection.name);
	}

	remove(): DeleteOpResult {
		return this.delete();
	}

	get() {
		if (this.subpath) return this.collection.findOne(this.document, { projection: { [this.subpath]: 1 } });
		if (this.document) return this.collection.findOne(this.document);
		return this.first();
	}

	set(value: any): any {
		value = decycle(value);
		if (this.updatepath) {
			return this.collection.updateOne(
				this.document,
				{ $set: { [this.updatepath]: value } },
				{ ...this.options, arrayFilters: this.arrayFilters }
			);
		}
		if (this.document) return this.collection.updateOne(this.document, { $set: value }, this.options); // if no document is specified also insert it because of upsert

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
			this.document = {};
			return this.set(value);
		}
	}

	exists() {
		if (this.subpath) {
			return this.collection.findOne(this.document, { projection: { [this.subpath]: 1 } }) != null;
		}

		return this.collection.findOne(this.document, { projection: {} }) != null;
	}

	push(element: any) {
		if (this.subpath) {
			return this.collection.updateOne(this.document, { $push: { [this.subpath]: element } }, this.options);
		}

		return this.set(element);
	}

	insert(element: any) {
		return this.push(element);
	}

	first() {
		if (this.subpath) return this.collection.findOne({}, { projection: { [this.subpath]: 1 } });

		return this.collection.findOne({}, { sort: { $natural: 1 } });
	}

	last() {
		if (this.subpath) {
			return this.collection.findOne(this.document);
		}

		return this.collection.findOne({}, { sort: { $natural: -1 } });
	}

	random() {
		if (this.subpath) {
			return this.collection.aggregate([{ $match: this.document }, { $sample: { size: 1 } }]);
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
