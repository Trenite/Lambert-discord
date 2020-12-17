"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongodb = exports.MongodbProperty = exports.MongoDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Datastore_1 = require("../structures/Datastore");
class MongoDatabase {
    constructor(uri) {
        this.uri = uri;
        this.provider = MongodbProperty;
    }
    init() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.uri) {
                this.mongod = require("../controllers/Mongod").default;
                this.uri = yield ((_a = this.mongod) === null || _a === void 0 ? void 0 : _a.getUri());
            }
            this.mongoConnection = yield mongoose_1.default.createConnection(this.uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            const { mongodb } = require("../models/init");
            yield mongodb(this.mongoConnection);
        });
    }
    destroy() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all([(_a = this.mongoConnection) === null || _a === void 0 ? void 0 : _a.close(), (_b = this.mongod) === null || _b === void 0 ? void 0 : _b.stop()]);
        });
    }
}
exports.MongoDatabase = MongoDatabase;
function decycle(obj, stack = []) {
    if (!obj || typeof obj !== "object")
        return obj;
    // @ts-ignore
    if (stack.includes(obj))
        return null;
    // @ts-ignore
    let s = stack.concat([obj]);
    return Array.isArray(obj)
        ? obj.map((x) => decycle(x, s))
        : // @ts-ignore
            Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, decycle(v, s)]));
}
class MongodbProperty extends Datastore_1.Property {
    constructor(client, path) {
        super(client, path);
        this.options = {};
        this.arrayFilters = [];
        const collection = path[0];
        if (typeof collection.filter == "function" || typeof collection.filter == "string") {
            // run js on mongodb: https://docs.mongodb.com/manual/reference/operator/query/where/
            collection.filter = { $where: collection.filter.toString() };
            this.document = collection.filter;
        }
        else if (typeof collection.filter == "object" && collection.filter) {
            this.document = collection.filter;
            collection.filter = { $match: collection.filter };
        }
        this.path = path.slice(1);
        path = this.path;
        const db = this.client.db;
        if (!db.mongoConnection)
            throw new Error("Database not connected");
        this.collection = db.mongoConnection.collection(collection.name);
        if (collection.filter) {
            var pipe = [];
            var arrayFilters = [];
            var up = [];
            var i = 0;
            pipe.push(collection.filter);
            this.path.forEach((x, i) => {
                if (!x.filter) {
                    up.push(x.name);
                    if (!pipe.last()["$project"])
                        return pipe.push({ $project: { [x.name]: "$" + x.name } });
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
            this.updatepath = up.length ? up.join(".") : undefined;
            this.arrayFilters = arrayFilters;
        }
        this.options.upsert = true;
    }
    convertFilterToQuery(obj) {
        var walked = [];
        var res = {};
        var stack = [{ obj: obj, stack: "" }];
        while (stack.length > 0) {
            var item = stack.pop();
            var obj = item.obj;
            for (var property in obj) {
                if (obj.hasOwnProperty(property)) {
                    if (typeof obj[property] == "object" && !Array.isArray(obj[property])) {
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
                    }
                    else {
                        if (Array.isArray(obj[property]))
                            obj[property] = { $in: obj[property] };
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
            return this.checkIfModified(this.collection.updateOne(this.document, { $unset: { [this.updatepath]: "" } }, Object.assign(Object.assign({}, this.options), { arrayFilters: this.arrayFilters })));
        }
        if (this.document)
            return this.collection.deleteOne(this.document);
        return this.collection.conn.dropCollection(this.collection.name);
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.pipe) {
                var lastProp = Object.keys(this.pipe.last()["$project"] || {})[0];
                if (this.pipe.last()["$match"] && this.pipe.length > 1)
                    this.pipe.push({ $project: { [lastProp]: "$$ROOT" } }); // used to get properly get the element if last pipe operator was an array filter
                var result = yield this.collection.aggregate(this.pipe).toArray();
                return result && result.length ? result[0][lastProp] : undefined;
            }
            return this.collection.find({}).toArray();
        });
    }
    set(value) {
        value = decycle(value);
        if (this.updatepath) {
            return this.checkIfModified(this.collection.updateOne(this.document, { $set: { [this.updatepath]: value } }, Object.assign(Object.assign({}, this.options), { arrayFilters: this.arrayFilters })));
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
        }
        else {
            if (this.document) {
                return this.checkIfModified(this.collection.updateOne(this.document, { $set: value }, this.options));
            }
            return this.collection.insertOne(value);
        }
    }
    exists() {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO make it efficient and do not fetch it
            return !!(yield this.get());
        });
    }
    checkIfModified(result) {
        return __awaiter(this, void 0, void 0, function* () {
            result = yield result;
            return result.modifiedCount > 0;
        });
    }
    push(element) {
        if (this.updatepath) {
            return this.checkIfModified(this.collection.updateOne(this.document, { $push: { [this.updatepath]: element } }, Object.assign(Object.assign({}, this.options), { arrayFilters: this.arrayFilters })));
        }
        return this.set(element);
    }
    pull() {
        if (this.subpath) {
            var { filter } = this.path.last();
            if (!filter)
                throw "the last property must specify a filter";
            return this.checkIfModified(this.collection.updateOne(this.document, { $pull: { [this.subpath]: filter } }, this.options));
        }
        return this.pop();
    }
    pop() {
        // TODO
        return this.collection.deleteOne({});
    }
    first() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.subpath) {
                var { name } = this.path.last();
                var result = yield this.collection
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
        });
    }
    last() {
        if (this.subpath) {
            // TODO
            return this.collection.findOne(this.document);
        }
        return this.collection.findOne({}, { sort: { $natural: -1 } });
    }
    random() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.subpath) {
                var { name } = this.path.last();
                var result = yield this.collection
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
        });
    }
}
exports.MongodbProperty = MongodbProperty;
function mongodb(db) {
    return __awaiter(this, void 0, void 0, function* () {
        var collections = {};
        (yield db.db.listCollections().toArray())
            .filter((c) => c.type === "collection") // @ts-ignore
            .forEach((c) => (collections[c.name] = c));
        // @ts-ignore
        yield Promise.all([
            // @ts-ignore
            !collections.guilds && db.createCollection("guilds"),
            !collections.users && db.createCollection("users"),
            !collections.user && db.createCollection("user"),
            !collections.shards && db.createCollection("shards"),
        ]);
        const guilds = yield db.collection("guilds").getIndexes();
        const users = yield db.collection("users").getIndexes();
        const user = yield db.collection("user").getIndexes();
        const shards = yield db.collection("shards").getIndexes();
        const NumberLong = (t) => 0; // placeholder, mongodb has internal NumberLong -> prevent not found error
        // @ts-ignore
        return Promise.all([
            db.collection("system").insertOne({
                _id: "getShardId",
                value: function (guild_id, num_shards) {
                    return (NumberLong(guild_id) >> 22) & num_shards;
                },
            }),
            // @ts-ignore
            !guilds.clientid && db.collection("user").createIndex({ id: 1 }, { unique: 1, name: "clientid" }),
            // @ts-ignore
            !guilds.guildid && db.collection("guilds").createIndex({ id: 1 }, { unique: 1, name: "guildid" }),
            !guilds.memberid && // @ts-ignore
                db
                    .collection("guilds")
                    .createIndex({ "members.user.id": 1 }, { unique: 1, name: "memberid", sparse: true }),
            !users.userid && db.collection("users").createIndex({ id: 1 }, { unique: 1, name: "userid" }),
            !user.userid && db.collection("user").createIndex({ id: 1 }, { unique: 1, name: "userid" }),
            !shards.shardid && db.collection("shards").createIndex({ id: 1 }, { unique: 1, name: "shardid" }),
        ]);
    });
}
exports.mongodb = mongodb;
//# sourceMappingURL=MongoDatabase.js.map