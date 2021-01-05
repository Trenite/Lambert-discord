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
exports.LambertWebSocketManager = void 0;
// @ts-nocheck
const discord_js_1 = require("discord.js");
const Constants_1 = require("./Constants");
const { ShardEvents, Events, WSCodes } = Constants_1.Constants;
try {
    var WebSocketManager = require("../../../discord.js/src/client/websocket/WebSocketManager");
}
catch (error) {
    var WebSocketManager = require("../../node_modules/discord.js/src/client/websocket/WebSocketManager");
}
try {
    var WebSocketShard = require("../../../discord.js/src/client/websocket/WebSocketShard");
}
catch (error) {
    var WebSocketShard = require("../../node_modules/discord.js/src/client/websocket/WebSocketShard");
}
const UNRECOVERABLE_CLOSE_CODES = Object.keys(WSCodes).slice(1).map(Number);
const UNRESUMABLE_CLOSE_CODES = [1000, 4006, 4007];
class LambertWebSocketManager {
    connect() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if ((_a = this.client.options.ws) === null || _a === void 0 ? void 0 : _a.sessionIDs) {
                this.client.options.ws.autoresume = true;
            }
            const invalidToken = new Error(WSCodes[4004]);
            let { url: gatewayURL, shards: recommendedShards, session_start_limit: sessionStartLimit, } = yield this.client.api.gateway.bot.get().catch((error) => {
                throw error.httpStatus === 401 ? invalidToken : error;
            });
            if (this.client.options.ws.gatewayURL)
                gatewayURL = this.client.options.ws.gatewayURL;
            this.sessionStartLimit = sessionStartLimit;
            const { total, remaining, reset_after } = sessionStartLimit;
            this.debug(`Fetched Gateway Information
    URL: ${gatewayURL}
    Recommended Shards: ${recommendedShards}`);
            this.debug(`Session Limit Information
    Total: ${total}
    Remaining: ${remaining}`);
            this.gateway = `${gatewayURL}/`;
            let { shards } = this.client.options;
            if (shards === "auto") {
                this.debug(`Using the recommended shard count provided by Discord: ${recommendedShards}`);
                this.totalShards = this.client.options.shardCount = recommendedShards;
                shards = this.client.options.shards = Array.from({ length: recommendedShards }, (_, i) => i);
            }
            shards = shards;
            this.totalShards = shards.length;
            this.debug(`Spawning shards: ${shards === null || shards === void 0 ? void 0 : shards.join(", ")}`);
            this.shardQueue = new Set(shards.map((id) => new WebSocketShard(this, id)));
            yield this._handleSessionLimit(remaining, reset_after);
            if ((_b = this.client.options.ws) === null || _b === void 0 ? void 0 : _b.autoresume)
                yield this.restoreStructure();
            this.createShards();
            return;
        });
    }
    restoreStructure() {
        return __awaiter(this, void 0, void 0, function* () {
            // client users
            const clientusers = yield this.client.data.user.get();
            // get all guilds for shards and readd them
            // find guilds with all current shard ids
            const guilds = yield this.client.data.guilds({ shardID: this.client.options.shards }).get();
            if (clientusers && clientusers[0]) {
                const user = clientusers[0];
                if (this.client.user) {
                    // @ts-ignore
                    this.client.user._patch(user);
                }
                else {
                    const clientUser = new discord_js_1.ClientUser(this.client, user);
                    this.client.user = clientUser;
                    this.client.users.cache.set(clientUser.id, clientUser);
                }
            }
            if (guilds && Array.isArray(guilds)) {
                for (const guild of guilds) {
                    this.client.guilds.add(guild);
                }
            }
        });
    }
    manageShard(shard) {
        if (!shard.eventsAttached) {
            shard.on(ShardEvents.ALL_READY, (unavailableGuilds) => {
                /**
                 * Emitted when a shard turns ready.
                 * @event Client#shardReady
                 * @param {number} id The shard ID that turned ready
                 * @param {?Set<string>} unavailableGuilds Set of unavailable guild IDs, if any
                 */
                this.client.emit(Events.SHARD_READY, shard.id, unavailableGuilds);
                if (!this.shardQueue.size)
                    this.reconnecting = false;
                this.checkShardsReady();
            });
            shard.on(ShardEvents.CLOSE, (event) => {
                if (event.code === 1000 ? this.destroyed : UNRECOVERABLE_CLOSE_CODES.includes(event.code)) {
                    /**
                     * Emitted when a shard's WebSocket disconnects and will no longer reconnect.
                     * @event Client#shardDisconnect
                     * @param {CloseEvent} event The WebSocket close event
                     * @param {number} id The shard ID that disconnected
                     */
                    this.client.emit(Events.SHARD_DISCONNECT, event, shard.id);
                    // @ts-ignore
                    this.debug(WSCodes[event.code], shard);
                    return;
                }
                if (UNRESUMABLE_CLOSE_CODES.includes(event.code)) {
                    // These event codes cannot be resumed
                    shard.sessionID = null;
                    this.client.emit(Events.SHARD_INVALIDATED, event, shard);
                }
                /**
                 * Emitted when a shard is attempting to reconnect or re-identify.
                 * @event Client#shardReconnecting
                 * @param {number} id The shard ID that is attempting to reconnect
                 */
                this.client.emit(Events.SHARD_RECONNECTING, shard.id);
                this.shardQueue.add(shard);
                if (shard.sessionID) {
                    this.debug(`Session ID is present, attempting an immediate reconnect...`, shard);
                    this.reconnect(true);
                }
                else {
                    shard.destroy({ reset: true, emit: false, log: false });
                    this.reconnect();
                }
            });
            shard.on(ShardEvents.READY, () => {
                this.client.emit(Events.SHARD_AUTHENTICATED, shard);
            });
            shard.on(ShardEvents.INVALID_SESSION, () => {
                this.client.emit(Events.SHARD_RECONNECTING, shard.id);
            });
            shard.on(ShardEvents.DESTROYED, () => {
                this.debug("Shard was destroyed but no WebSocket connection was present! Reconnecting...", shard);
                this.client.emit(Events.SHARD_RECONNECTING, shard.id);
                this.shardQueue.add(shard);
                this.reconnect();
            });
            shard.eventsAttached = true;
        }
    }
    createShards() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // If we don't have any shards to handle, return
            if (!this.shardQueue.size)
                return;
            const [shard] = this.shardQueue;
            this.shardQueue.delete(shard);
            this.manageShard(shard);
            var sessionIDs = ((_a = this.client.options.ws) === null || _a === void 0 ? void 0 : _a.sessionIDs) || {};
            shard.sessionID = (sessionIDs === null || sessionIDs === void 0 ? void 0 : sessionIDs[shard.id]) || null;
            this.shards.set(shard.id, shard);
            const handleError = (error) => {
                if (error && error.code && UNRECOVERABLE_CLOSE_CODES.includes(error.code)) {
                    // @ts-ignore
                    throw new Error(WSCodes[error.code]);
                    // Undefined if session is invalid, error event for regular closes
                }
                else if (!error || error.code) {
                    this.debug("Failed to connect to the gateway, requeueing...", shard);
                    if (sessionIDs === null || sessionIDs === void 0 ? void 0 : sessionIDs[shard.id]) {
                        sessionIDs[shard.id] = null;
                    }
                    this.shardQueue.add(shard);
                }
                else {
                    throw error;
                }
            };
            try {
                // do not await connect -> start all at the same time
                var connect = shard.connect().catch((e) => {
                    handleError(null);
                    this.createShards();
                });
                if (!(sessionIDs === null || sessionIDs === void 0 ? void 0 : sessionIDs[shard.id])) {
                    yield discord_js_1.Util.delayFor(5000); // await 5s rate limit
                }
            }
            catch (error) {
                handleError(error);
            }
            // If we have more shards, add a 5s delay
            if (this.shardQueue.size) {
                this.debug(`Shard Queue Size: ${this.shardQueue.size}; ${sessionIDs ? "immediate connect all" : "continuing in 5 seconds..."}`);
                if (!(sessionIDs === null || sessionIDs === void 0 ? void 0 : sessionIDs[shard.id])) {
                    yield this._handleSessionLimit();
                }
                return this.createShards();
            }
            return;
        });
    }
    destroy(keepalive = true) {
        if (this.destroyed)
            return;
        this.debug(`Lambert Websocket Manager was destroyed.`);
        this.destroyed = true;
        this.shardQueue.clear();
        for (const shard of this.shards.values())
            shard.destroy({ closeCode: 1000, reset: true, emit: false, log: false, keepalive });
    }
}
exports.LambertWebSocketManager = LambertWebSocketManager;
WebSocketManager.prototype.connect = LambertWebSocketManager.prototype.connect;
WebSocketManager.prototype.createShards = LambertWebSocketManager.prototype.createShards;
WebSocketManager.prototype.destroy = LambertWebSocketManager.prototype.destroy;
WebSocketManager.prototype.manageShard = LambertWebSocketManager.prototype.manageShard;
WebSocketManager.prototype.restoreStructure = LambertWebSocketManager.prototype.restoreStructure;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGFtYmVydFdlYlNvY2tldE1hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3RydWN0dXJlcy9MYW1iZXJ0V2ViU29ja2V0TWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxjQUFjO0FBQ2QsMkNBQStHO0FBQy9HLDJDQUF3QztBQUd4QyxNQUFNLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsR0FBRyxxQkFBUyxDQUFDO0FBRW5ELElBQUk7SUFDSCxJQUFJLGdCQUFnQixHQUFHLE9BQU8sQ0FBQywyREFBMkQsQ0FBQyxDQUFDO0NBQzVGO0FBQUMsT0FBTyxLQUFLLEVBQUU7SUFDZixJQUFJLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxxRUFBcUUsQ0FBQyxDQUFDO0NBQ3RHO0FBRUQsSUFBSTtJQUNILElBQUksY0FBYyxHQUFHLE9BQU8sQ0FBQyx5REFBeUQsQ0FBQyxDQUFDO0NBQ3hGO0FBQUMsT0FBTyxLQUFLLEVBQUU7SUFDZixJQUFJLGNBQWMsR0FBRyxPQUFPLENBQUMsbUVBQW1FLENBQUMsQ0FBQztDQUNsRztBQUVELE1BQU0seUJBQXlCLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzVFLE1BQU0sdUJBQXVCLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBV25ELE1BQWEsdUJBQXVCO0lBQ3JCLE9BQU87OztZQUNwQixVQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUUsMENBQUUsVUFBVSxFQUFFO2dCQUN2QyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQzthQUN6QztZQUVELE1BQU0sWUFBWSxHQUFHLElBQUksS0FB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