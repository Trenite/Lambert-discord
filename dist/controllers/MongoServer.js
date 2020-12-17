"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_memory_server_1 = require("mongodb-memory-server");
const fs_1 = __importDefault(require("fs"));
const dbPath = `${__dirname}/../../database/`;
if (!fs_1.default.existsSync(dbPath))
    fs_1.default.mkdirSync(dbPath);
const mongod = new mongodb_memory_server_1.MongoMemoryServer({
    instance: {
        dbName: "lambert",
        dbPath,
        storageEngine: "wiredTiger",
        auth: false,
        args: [],
        port: 54618,
    },
    autoStart: true,
});
exports.default = mongod;
//# sourceMappingURL=MongoServer.js.map