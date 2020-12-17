"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Constants = void 0;
const discord_js_1 = require("discord.js");
// @ts-ignore
const Events = {
    CLIENT_INIT: "clientInit",
    SHARD_AUTHENTICATED: "shardAuthenticated",
    SHARD_INVALIDATED: "shardInvalidated",
};
var Constants = Object.assign(Object.assign({}, discord_js_1.Constants), { Events: Object.assign(Object.assign({}, discord_js_1.Constants.Events), Events) });
exports.Constants = Constants;
//# sourceMappingURL=Constants.js.map