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
const LambertWebSocketShard_1 = require("./LambertWebSocketShard");
const UNRECOVERABLE_CLOSE_CODES = Object.keys(WSCodes).slice(1).map(Number);
const UNRESUMABLE_CLOSE_CODES = [1000, 4006, 4007];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGFtYmVydFdlYlNvY2tldE1hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3RydWN0dXJlcy9MYW1iZXJ0V2ViU29ja2V0TWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxjQUFjO0FBQ2QsMkNBQXdIO0FBRXhILDJDQUF3QztBQUN4QyxNQUFNLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsR0FBRyxxQkFBUyxDQUFDO0FBRW5ELG1FQUFnRTtBQUVoRSxNQUFNLHlCQUF5QixHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM1RSxNQUFNLHVCQUF1QixHQUFHLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztBQVFuRCxNQUFhLHVCQUF3QixTQUFRLDZCQUFnQjtJQUM1RCxZQUFZLE1BQTRCOztRQUN2QyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFZCxVQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUUsMENBQUUsVUFBVSxFQUFFO1lBQ3ZDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1NBQ3pDO0lBQ0YsQ0FBQztJQUVhLE9BQU87OztZQUNwQixNQUFNLFlBQVksR0FBRyxJQUFJLHFCQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDakQsTUFBTSxFQUNMLEdBQUcsRUFBRSxVQUFVLEVBQ2YsTUFBTSxFQUFFLGlCQUFpQixFQUN6QixtQkFBbUIsRUFBRSxpQkFBaUIsR0FFdEMsR0FBRyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBVSxFQUFFLEVBQUU7Z0JBQ2hFLE1BQU0sS0FBSyxDQUFDLFVBQVUsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1lBQ3ZELENBQUMsQ0FBQyxDQUFDO1lBRUgsSUFBSSxDQUFDLGlCQUFpQixHQUFHLGlCQUFpQixDQUFDO1lBRTNDLE1BQU0sRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxHQUFHLGlCQUFpQixDQUFDO1lBRTVELElBQUksQ0FBQyxLQUFLLENBQUM7V0FDRixVQUFVOzBCQUNLLGlCQUFpQixFQUFFLENBQUMsQ0FBQztZQUU3QyxJQUFJLENBQUMsS0FBSyxDQUFDO2FBQ0EsS0FBSztpQkFDRCxTQUFTLEVBQUUsQ0FBQyxDQUFDO1lBRTVCLElBQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxVQUFVLEdBQUcsQ0FBQztZQUVoQyxJQUFJLEVBQUUsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7WUFFckMsSUFBSSxNQUFNLEtBQUssTUFBTSxFQUFFO2dCQUN0QixJQUFJLENBQUMsS0FBSyxDQUFDLDBEQUEwRCxpQkFBaUIsRUFBRSxDQUFDLENBQUM7Z0JBQzFGLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHLGlCQUFpQixDQUFDO2dCQUN0RSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQUUsaUJBQWlCLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQzdGO1lBQ0QsTUFBTSxHQUFhLE1BQU0sQ0FBQztZQUUxQixJQUFJLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7WUFDakMsSUFBSSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsTUFBTSxhQUFOLE1BQU0sdUJBQU4sTUFBTSxDQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDckQsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxJQUFJLDZDQUFxQixDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFbkYsTUFBTSxJQUFJLENBQUMsbUJBQW1CLENBQUMsU0FBUyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBQ3ZELFVBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBRSwwQ0FBRSxVQUFVO2dCQUFFLE1BQU0sSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7WUFFdEUsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ3BCLE9BQU87O0tBQ1A7SUFFYSxnQkFBZ0I7O1lBQzdCLGVBQWU7WUFDZixNQUFNLFdBQVcsR0FBRyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUV0RCwyQ0FBMkM7WUFDM0MseUNBQXlDO1lBQ3pDLE1BQU0sTUFBTSxHQUFVLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7WUFFbkcsSUFBSSxXQUFXLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUNsQyxNQUFNLElBQUksR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzVCLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUU7b0JBQ3JCLGFBQWE7b0JBQ2IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUM5QjtxQkFBTTtvQkFDTixNQUFNLFVBQVUsR0FBRyxJQUFJLHVCQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztvQkFDckQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDO29CQUM5QixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUUsVUFBVSxDQUFDLENBQUM7aUJBQ3ZEO2FBQ0Q7WUFFRCxJQUFJLE1BQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUNwQyxLQUFLLE1BQU0sS0FBSyxJQUFJLE1BQU0sRUFBRTtvQkFDM0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO2lCQUM5QjthQUNEO1FBQ0YsQ0FBQztLQUFBO0lBRU8sV0FBVyxDQUFDLEtBQTRCO1FBQy9DLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxFQUFFO1lBQzFCLEtBQUssQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxDQUFDLGlCQUFpQixFQUFFLEVBQUU7Z0JBQ3JEOzs7OzttQkFLRztnQkFDSCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxFQUFFLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztnQkFFbEUsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSTtvQkFBRSxJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztnQkFDckQsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7WUFDekIsQ0FBQyxDQUFDLENBQUM7WUFFSCxLQUFLLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRTtnQkFDckMsSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMseUJBQXlCLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRTtvQkFDMUY7Ozs7O3VCQUtHO29CQUNILElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUMzRCxhQUFhO29CQUNiLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztvQkFDdkMsT0FBTztpQkFDUDtnQkFFRCxJQUFJLHVCQUF1QixDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUU7b0JBQ2pELHNDQUFzQztvQkFDdEMsS0FBSyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7b0JBQ3ZCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7aUJBQ3pEO2dCQUVEOzs7O21CQUlHO2dCQUNILElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBRXRELElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUUzQixJQUFJLEtBQUssQ0FBQyxTQUFTLEVBQUU7b0JBQ3BCLElBQUksQ0FBQyxLQUFLLENBQUMsNkRBQTZELEVBQUUsS0FBSyxDQUFDLENBQUM7b0JBQ2pGLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ3JCO3FCQUFNO29CQUNOLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7b0JBQ3hELElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztpQkFDakI7WUFDRixDQUFDLENBQUMsQ0FBQztZQUVILEtBQUssQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUU7Z0JBQ2hDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNyRCxDQUFDLENBQUMsQ0FBQztZQUVILEtBQUssQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLGVBQWUsRUFBRSxHQUFHLEVBQUU7Z0JBQzFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDdkQsQ0FBQyxDQUFDLENBQUM7WUFFSCxLQUFLLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFO2dCQUNwQyxJQUFJLENBQUMsS0FBSyxDQUFDLDhFQUE4RSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUVsRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsa0JBQWtCLEVBQUUsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUV0RCxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDM0IsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ2xCLENBQUMsQ0FBQyxDQUFDO1lBRUgsS0FBSyxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7U0FDNUI7SUFDRixDQUFDO0lBRUQsK0VBQStFO0lBQy9FLHlCQUF5QjtJQUN6Qiw2Q0FBNkM7SUFDN0MsSUFBSTtJQUVZLFlBQVk7OztZQUMzQixnREFBZ0Q7WUFDaEQsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSTtnQkFBRSxPQUFPO1lBRWxDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO1lBRWhDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRTlCLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7WUFFeEIsSUFBSSxVQUFVLEdBQVEsT0FBdUIsSUFBSSxDQUFDLE1BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSwwQ0FBRSxVQUFVLEtBQUksRUFBRSxDQUFDO1lBRXZGLEtBQUssQ0FBQyxTQUFTLEdBQUcsQ0FBQSxVQUFVLGFBQVYsVUFBVSx1QkFBVixVQUFVLENBQUcsS0FBSyxDQUFDLEVBQUUsTUFBSyxJQUFJLENBQUM7WUFFakQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUVqQyxNQUFNLFdBQVcsR0FBRyxDQUFDLEtBQVUsRUFBRSxFQUFFO2dCQUNsQyxJQUFJLEtBQUssSUFBSSxLQUFLLENBQUMsSUFBSSxJQUFJLHlCQUF5QixDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUU7b0JBQzFFLGFBQWE7b0JBQ2IsTUFBTSxJQUFJLHFCQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUN4QyxrRUFBa0U7aUJBQ2xFO3FCQUFNLElBQUksQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLElBQUksRUFBRTtvQkFDaEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxpREFBaUQsRUFBRSxLQUFLLENBQUMsQ0FBQztvQkFDckUsSUFBSSxVQUFVLGFBQVYsVUFBVSx1QkFBVixVQUFVLENBQUcsS0FBSyxDQUFDLEVBQUUsR0FBRzt3QkFDM0IsVUFBVSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUM7cUJBQzVCO29CQUNELElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO2lCQUMzQjtxQkFBTTtvQkFDTixNQUFNLEtBQUssQ0FBQztpQkFDWjtZQUNGLENBQUMsQ0FBQztZQUVGLElBQUk7Z0JBQ0gscURBQXFEO2dCQUNyRCxJQUFJLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBTSxFQUFFLEVBQUU7b0JBQzlDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDbEIsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO2dCQUNyQixDQUFDLENBQUMsQ0FBQztnQkFDSCxJQUFJLEVBQUMsVUFBVSxhQUFWLFVBQVUsdUJBQVYsVUFBVSxDQUFHLEtBQUssQ0FBQyxFQUFFLEVBQUMsRUFBRTtvQkFDNUIsTUFBTSxpQkFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLHNCQUFzQjtpQkFDakQ7YUFDRDtZQUFDLE9BQU8sS0FBSyxFQUFFO2dCQUNmLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUNuQjtZQUNELHlDQUF5QztZQUN6QyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFO2dCQUN6QixJQUFJLENBQUMsS0FBSyxDQUNULHFCQUFxQixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksS0FDeEMsVUFBVSxDQUFDLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsNEJBQ3hDLEVBQUUsQ0FDRixDQUFDO2dCQUNGLElBQUksRUFBQyxVQUFVLGFBQVYsVUFBVSx1QkFBVixVQUFVLENBQUcsS0FBSyxDQUFDLEVBQUUsRUFBQyxFQUFFO29CQUM1QixNQUFNLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO2lCQUNqQztnQkFDRCxPQUFPLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQzthQUMzQjtZQUVELE9BQU87O0tBQ1A7SUFFUyxPQUFPLENBQUMsWUFBcUIsSUFBSTtRQUMxQyxJQUFJLElBQUksQ0FBQyxTQUFTO1lBQUUsT0FBTztRQUMzQixJQUFJLENBQUMsS0FBSyxDQUFDLDBDQUEwQyxDQUFDLENBQUM7UUFDdkQsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7UUFDdEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUN4QixLQUFLLE1BQU0sS0FBSyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFO1lBQ3ZDLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUM7SUFDdEYsQ0FBQztDQUNEO0FBcE9ELDBEQW9PQyJ9