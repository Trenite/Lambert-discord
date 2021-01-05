// @ts-nocheck
import { WebSocketManager as WSManager, WebSocketOptions, Util, WebSocketShard, ClientUser } from "discord.js";
import { Constants } from "./Constants";
import { LambertDiscordClient } from "./LambertDiscordClient";
import { LambertWebSocketShard } from "./LambertWebSocketShard";
const { ShardEvents, Events, WSCodes } = Constants;

try {
	var WebSocketManager = require("../../../discord.js/src/client/websocket/WebSocketManager");
} catch (error) {
	var WebSocketManager = require("../../node_modules/discord.js/src/client/websocket/WebSocketManager");
}

try {
	var WebSocketShard = require("../../../discord.js/src/client/websocket/WebSocketShard");
} catch (error) {
	var WebSocketShard = require("../../node_modules/discord.js/src/client/websocket/WebSocketShard");
}

const UNRECOVERABLE_CLOSE_CODES = Object.keys(WSCodes).slice(1).map(Number);
const UNRESUMABLE_CLOSE_CODES = [1000, 4006, 4007];

declare module "discord.js" {
	interface WebSocketManager {
		// @ts-ignore
		destroy(keepalive?: number): void;
	}
}

export interface LambertWebSocketManager extends WSManager {}

export class LambertWebSocketManager {
	private async connect(): Promise<void> {
		if (this.client.options.ws?.sessionIDs) {
			this.client.options.ws.autoresume = true;
		}

		const invalidToken = new Error(WSCodes[4004]);
		let {
			url: gatewayURL,
			shards: recommendedShards,
			session_start_limit: sessionStartLimit,
		} = await this.client.api.gateway.bot.get().catch((error: any) => {
			throw error.httpStatus === 401 ? invalidToken : error;
		});

		if (this.client.options.ws.gatewayURL) gatewayURL = this.client.options.ws.gatewayURL;

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
		shards = <number[]>shards;

		this.totalShards = shards.length;
		this.debug(`Spawning shards: ${shards?.join(", ")}`);
		this.shardQueue = new Set(shards.map((id) => new WebSocketShard(this, id)));

		await this._handleSessionLimit(remaining, reset_after);
		if (this.client.options.ws?.autoresume) await this.restoreStructure();

		this.createShards();
		return;
	}

	private async restoreStructure() {
		// client users
		const clientusers = await this.client.data.user.get();

		// get all guilds for shards and readd them
		// find guilds with all current shard ids
		const guilds: any[] = await this.client.data.guilds({ shardID: this.client.options.shards }).get();

		if (clientusers && clientusers[0]) {
			const user = clientusers[0];
			if (this.client.user) {
				// @ts-ignore
				this.client.user._patch(user);
			} else {
				const clientUser = new ClientUser(this.client, user);
				this.client.user = clientUser;
				this.client.users.cache.set(clientUser.id, clientUser);
			}
		}

		if (guilds && Array.isArray(guilds)) {
			for (const guild of guilds) {
				this.client.guilds.add(guild);
			}
		}
	}

	private manageShard(shard: LambertWebSocketShard) {
		if (!shard.eventsAttached) {
			shard.on(ShardEvents.ALL_READY, (unavailableGuilds) => {
				/**
				 * Emitted when a shard turns ready.
				 * @event Client#shardReady
				 * @param {number} id The shard ID that turned ready
				 * @param {?Set<string>} unavailableGuilds Set of unavailable guild IDs, if any
				 */
				this.client.emit(Events.SHARD_READY, shard.id, unavailableGuilds);

				if (!this.shardQueue.size) this.reconnecting = false;
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
				} else {
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

	protected async createShards(): Promise<void> {
		// If we don't have any shards to handle, return
		if (!this.shardQueue.size) return;

		const [shard] = this.shardQueue;

		this.shardQueue.delete(shard);

		this.manageShard(shard);

		var sessionIDs: any = (<LambertDiscordClient>this.client).options.ws?.sessionIDs || {};

		shard.sessionID = sessionIDs?.[shard.id] || null;

		this.shards.set(shard.id, shard);

		const handleError = (error: any) => {
			if (error && error.code && UNRECOVERABLE_CLOSE_CODES.includes(error.code)) {
				// @ts-ignore
				throw new Error(WSCodes[error.code]);
				// Undefined if session is invalid, error event for regular closes
			} else if (!error || error.code) {
				this.debug("Failed to connect to the gateway, requeueing...", shard);
				if (sessionIDs?.[shard.id]) {
					sessionIDs[shard.id] = null;
				}
				this.shardQueue.add(shard);
			} else {
				throw error;
			}
		};

		try {
			// do not await connect -> start all at the same time
			var connect = shard.connect().catch((e: any) => {
				handleError(null);
				this.createShards();
			});
			if (!sessionIDs?.[shard.id]) {
				await Util.delayFor(5000); // await 5s rate limit
			}
		} catch (error) {
			handleError(error);
		}
		// If we have more shards, add a 5s delay
		if (this.shardQueue.size) {
			this.debug(
				`Shard Queue Size: ${this.shardQueue.size}; ${
					sessionIDs ? "immediate connect all" : "continuing in 5 seconds..."
				}`
			);
			if (!sessionIDs?.[shard.id]) {
				await this._handleSessionLimit();
			}
			return this.createShards();
		}

		return;
	}

	protected destroy(keepalive: boolean = true) {
		if (this.destroyed) return;
		this.debug(`Lambert Websocket Manager was destroyed.`);
		this.destroyed = true;
		this.shardQueue.clear();
		for (const shard of this.shards.values())
			shard.destroy({ closeCode: 1000, reset: true, emit: false, log: false, keepalive });
	}
}

WebSocketManager.prototype.connect = LambertWebSocketManager.prototype.connect;
WebSocketManager.prototype.createShards = LambertWebSocketManager.prototype.createShards;
WebSocketManager.prototype.destroy = LambertWebSocketManager.prototype.destroy;
WebSocketManager.prototype.manageShard = LambertWebSocketManager.prototype.manageShard;
WebSocketManager.prototype.restoreStructure = LambertWebSocketManager.prototype.restoreStructure;

export interface LambertWebSocketOptions extends WebSocketOptions {
	sessionIDs?: string[];
	autoresume?: boolean;
	gatewayURL?: string;
}
