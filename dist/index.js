"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Constants = exports.Command = exports.Listener = exports.SyncDatabase = exports.LambertGuildMember = exports.LambertGuild = exports.LambertMessage = exports.LambertWebSocketManager = exports.LambertWebSocketShard = exports.LambertDiscordClient = void 0;
const LambertDiscordClient_1 = require("./structures/LambertDiscordClient");
Object.defineProperty(exports, "LambertDiscordClient", { enumerable: true, get: function () { return LambertDiscordClient_1.LambertDiscordClient; } });
const SyncDatabase_1 = require("./structures/SyncDatabase");
Object.defineProperty(exports, "SyncDatabase", { enumerable: true, get: function () { return SyncDatabase_1.SyncDatabase; } });
const Command_1 = require("./structures/Command");
Object.defineProperty(exports, "Command", { enumerable: true, get: function () { return Command_1.Command; } });
const Constants_1 = require("./structures/Constants");
Object.defineProperty(exports, "Constants", { enumerable: true, get: function () { return Constants_1.Constants; } });
const LambertExtended_1 = require("./structures/LambertExtended");
Object.defineProperty(exports, "LambertGuildMember", { enumerable: true, get: function () { return LambertExtended_1.LambertGuildMember; } });
Object.defineProperty(exports, "LambertGuild", { enumerable: true, get: function () { return LambertExtended_1.LambertGuild; } });
Object.defineProperty(exports, "LambertMessage", { enumerable: true, get: function () { return LambertExtended_1.LambertMessage; } });
Object.defineProperty(exports, "LambertWebSocketManager", { enumerable: true, get: function () { return LambertExtended_1.LambertWebSocketManager; } });
Object.defineProperty(exports, "LambertWebSocketShard", { enumerable: true, get: function () { return LambertExtended_1.LambertWebSocketShard; } });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNEVBQXlFO0FBZXhFLHFHQWZRLDJDQUFvQixPQWVSO0FBZHJCLDREQUF5RDtBQW9CeEQsNkZBcEJRLDJCQUFZLE9Bb0JSO0FBbkJiLGtEQUErQztBQXNCOUMsd0ZBdEJRLGlCQUFPLE9Bc0JSO0FBckJSLHNEQUFtRDtBQXNCbEQsMEZBdEJRLHFCQUFTLE9Bc0JSO0FBcEJWLGtFQU1zQztBQVNyQyxtR0FkQSxvQ0FBa0IsT0FjQTtBQURsQiw2RkFaQSw4QkFBWSxPQVlBO0FBRFosK0ZBVkEsZ0NBQWMsT0FVQTtBQURkLHdHQVJBLHlDQUF1QixPQVFBO0FBRHZCLHNHQU5BLHVDQUFxQixPQU1BO0FBSnRCLG9EQUFpRDtBQVVoRCx5RkFWUSxtQkFBUSxPQVVSO0FBTVQ7Ozs7Ozs7OztHQVNHIn0=