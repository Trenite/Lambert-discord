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
const discord_js_1 = require("discord.js");
const Constants_1 = require("../../structures/Constants");
const { ShardEvents, Events, WSCodes } = Constants_1.Constants;
const LambertWebSocketShard_1 = require("./LambertWebSocketShard");
const UNRECOVERABLE_CLOSE_CODES = Object.keys(WSCodes).slice(1).map(Number);
const UNRESUMABLE_CLOSE_CODES = [1000, 4006, 4007];
// @ts-ignore
global.WebSocketManager = discord_js_1.WebSocketManager;
class LambertWebSocketManager extends discord_js_1.WebSocketManager {
    constructor(client) {
        var _a;
        super(client);
        if ((_a = this.client.options.ws) === null || _a === void 0 ? void 0 : _a.sessionIDs) {
            this.client.options.ws.autoresume = true;
        }
    }
    connect() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const invalidToken = new discord_js_1.DJSError(WSCodes[4004]);
            const { url: gatewayURL, shards: recommendedShards, session_start_limit: sessionStartLimit, } = yield this.client.api.gateway.bot.get().catch((error) => {
                throw error.httpStatus === 401 ? invalidToken : error;
            });
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
            this.shardQueue = new Set(shards.map((id) => new LambertWebSocketShard_1.LambertWebSocketShard(this, id)));
            yield this._handleSessionLimit(remaining, reset_after);
            if ((_a = this.client.options.ws) === null || _a === void 0 ? void 0 : _a.autoresume)
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
    // protected handlePacket(packet: any, shard: LambertWebSocketShard): boolean {
    // 	packet.shard = shard;
    // 	return super.handlePacket(packet, shard);
    // }
    createShards() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // If we don't have any shards to handle, return
            if (!this.shardQueue.size)
                return false;
            const [shard] = this.shardQueue;
            this.shardQueue.delete(shard);
            this.manageShard(shard);
            var sessionIDs = ((_a = this.client.options.ws) === null || _a === void 0 ? void 0 : _a.sessionIDs) || {};
            shard.sessionID = (sessionIDs === null || sessionIDs === void 0 ? void 0 : sessionIDs[shard.id]) || null;
            this.shards.set(shard.id, shard);
            const handleError = (error) => {
                if (error && error.code && UNRECOVERABLE_CLOSE_CODES.includes(error.code)) {
                    // @ts-ignore
                    throw new discord_js_1.DJSError(WSCodes[error.code]);
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
            return true;
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
//# sourceMappingURL=LambertWebSocketManager.js.map