"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Constants = exports.Command = exports.Listener = exports.SyncDatabase = exports.LambertGuildMember = exports.LambertGuild = exports.LambertMessage = exports.LambertWebSocketManager = exports.LambertWebSocketShard = exports.LambertDiscordClient = void 0;
const LambertDiscordClient_1 = require("./structures/LambertDiscordClient");
Object.defineProperty(exports, "LambertDiscordClient", { enumerable: true, get: function () { return LambertDiscordClient_1.LambertDiscordClient; } });
const LambertWebSocketManager_1 = require("./structures/LambertWebSocketManager");
Object.defineProperty(exports, "LambertWebSocketManager", { enumerable: true, get: function () { return LambertWebSocketManager_1.LambertWebSocketManager; } });
const LambertWebSocketShard_1 = require("./structures/LambertWebSocketShard");
Object.defineProperty(exports, "LambertWebSocketShard", { enumerable: true, get: function () { return LambertWebSocketShard_1.LambertWebSocketShard; } });
const SyncDatabase_1 = require("./structures/SyncDatabase");
Object.defineProperty(exports, "SyncDatabase", { enumerable: true, get: function () { return SyncDatabase_1.SyncDatabase; } });
const Command_1 = require("./structures/Command");
Object.defineProperty(exports, "Command", { enumerable: true, get: function () { return Command_1.Command; } });
const Constants_1 = require("./structures/Constants");
Object.defineProperty(exports, "Constants", { enumerable: true, get: function () { return Constants_1.Constants; } });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNEVBQXlFO0FBYXhFLHFHQWJRLDJDQUFvQixPQWFSO0FBWnJCLGtGQUErRTtBQWM5RSx3R0FkUSxpREFBdUIsT0FjUjtBQWJ4Qiw4RUFBMkU7QUFZMUUsc0dBWlEsNkNBQXFCLE9BWVI7QUFYdEIsNERBQXlEO0FBZ0J4RCw2RkFoQlEsMkJBQVksT0FnQlI7QUFmYixrREFBK0M7QUFrQjlDLHdGQWxCUSxpQkFBTyxPQWtCUjtBQWpCUixzREFBbUQ7QUFrQmxELDBGQWxCUSxxQkFBUyxPQWtCUjtBQWhCVixrRUFBa0U7QUFXakUsbUdBWFEsb0NBQWtCLE9BV1I7QUFWbkIsNERBQXlEO0FBU3hELDZGQVRRLDJCQUFZLE9BU1I7QUFSYixnRUFBNkQ7QUFPNUQsK0ZBUFEsK0JBQWMsT0FPUjtBQU5mLG9EQUFpRDtBQVVoRCx5RkFWUSxtQkFBUSxPQVVSO0FBTVQ7Ozs7Ozs7OztHQVNHIn0=