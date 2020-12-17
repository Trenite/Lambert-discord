"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Datastore = exports.Constants = exports.Command = exports.Listener = exports.SyncDatabase = exports.MongoDatabase = exports.LambertGuildMember = exports.LambertGuild = exports.LambertMessage = exports.LambertWebSocketManager = exports.LambertWebSocketShard = exports.LambertDiscordClient = void 0;
const LambertDiscordClient_1 = require("./client/LambertDiscordClient");
Object.defineProperty(exports, "LambertDiscordClient", { enumerable: true, get: function () { return LambertDiscordClient_1.LambertDiscordClient; } });
const LambertWebSocketManager_1 = require("./client/websocket/LambertWebSocketManager");
Object.defineProperty(exports, "LambertWebSocketManager", { enumerable: true, get: function () { return LambertWebSocketManager_1.LambertWebSocketManager; } });
const LambertWebSocketShard_1 = require("./client/websocket/LambertWebSocketShard");
Object.defineProperty(exports, "LambertWebSocketShard", { enumerable: true, get: function () { return LambertWebSocketShard_1.LambertWebSocketShard; } });
const MongodbProvider_1 = require("./controllers/MongodbProvider");
Object.defineProperty(exports, "MongoDatabase", { enumerable: true, get: function () { return MongodbProvider_1.MongoDatabase; } });
const SyncDatabase_1 = require("./controllers/SyncDatabase");
Object.defineProperty(exports, "SyncDatabase", { enumerable: true, get: function () { return SyncDatabase_1.SyncDatabase; } });
const Command_1 = require("./structures/Command");
Object.defineProperty(exports, "Command", { enumerable: true, get: function () { return Command_1.Command; } });
const Constants_1 = require("./structures/Constants");
Object.defineProperty(exports, "Constants", { enumerable: true, get: function () { return Constants_1.Constants; } });
const Provider_1 = require("./structures/Provider");
Object.defineProperty(exports, "Datastore", { enumerable: true, get: function () { return Provider_1.Datastore; } });
const LambertExtended_1 = require("./structures/LambertExtended");
Object.defineProperty(exports, "LambertGuildMember", { enumerable: true, get: function () { return LambertExtended_1.LambertGuildMember; } });
const LambertGuild_1 = require("./structures/LambertGuild");
Object.defineProperty(exports, "LambertGuild", { enumerable: true, get: function () { return LambertGuild_1.LambertGuild; } });
const LambertMessage_1 = require("./structures/LambertMessage");
Object.defineProperty(exports, "LambertMessage", { enumerable: true, get: function () { return LambertMessage_1.LambertMessage; } });
const Listener_1 = require("./structures/Listener");
Object.defineProperty(exports, "Listener", { enumerable: true, get: function () { return Listener_1.Listener; } });
/**
 * ┌────────┐
 * │Database│
 * └────────┘
 *
 * Every Bot has its own database
 * Guild, Users Collection
 * Guild has members
 *
 */
//# sourceMappingURL=index.js.map