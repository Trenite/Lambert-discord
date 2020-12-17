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
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongodb = void 0;
function mongodb(db) {
    return __awaiter(this, void 0, void 0, function* () {
        var collections = {};
        (yield db.db.listCollections().toArray())
            .filter((c) => c.type === "collection")
            .forEach((c) => (collections[c.name] = c));
        yield Promise.all([
            !collections.guilds && db.createCollection("guilds"),
            !collections.users && db.createCollection("users"),
            !collections.shards && db.createCollection("shards"),
        ]);
        const guilds = yield db.collection("guilds").getIndexes();
        const users = yield db.collection("users").getIndexes();
        const shards = yield db.collection("shards").getIndexes();
        return Promise.all([
            !guilds.guildid && db.collection("guilds").createIndex({ id: 1 }, { unique: 1, name: "guildid" }),
            !guilds.memberid &&
                db
                    .collection("guilds")
                    .createIndex({ "members.user.id": 1 }, { unique: 1, name: "memberid", sparse: true }),
            !users.userid && db.collection("users").createIndex({ id: 1 }, { unique: 1, name: "userid" }),
            !shards.shardid && db.collection("shards").createIndex({ id: 1 }, { unique: 1, name: "shardid" }),
        ]);
    });
}
exports.mongodb = mongodb;
//# sourceMappingURL=init.js.map