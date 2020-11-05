import { WebSocketManager, WebSocketOptions, DJSError, Util, WebSocketShard } from "discord.js";
import { Constants } from "../../structures/Constants";
const { ShardEvents, Events, WSCodes } = Constants;
import { LambertDiscordClient } from "../LambertDiscordClient";
import { LambertWebSocketShard } from "./LambertWebSocketShard";

const UNRECOVERABLE_CLOSE_CODES = Object.keys(WSCodes).slice(1).map(Number);
const UNRESUMABLE_CLOSE_CODES = [1000, 4006, 4007];

// @ts-ignore
global.WebSocketManager = WebSocketManager;

export class LambertWebSocketManager extends WebSocketManager {
	private sessionIDs: (string | null)[] | null;

	constructor(client: LambertDiscordClient) {
		super(client);

		this.sessionIDs = client.options.ws?.sessionIDs || null;
	}

	protected async connect(): Promise<void> {
		const invalidToken = new DJSError(WSCodes[4004]);
		const {
			url: gatewayURL,
			shards: recommendedShards,
			session_start_limit: sessionStartLimit,
			// @ts-ignore
		} = await this.client.api.gateway.bot.get().catch((error: any) => {
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
		shards = <number[]>shards;

		this.totalShards = shards.length;
		this.debug(`Spawning shards: ${shards?.join(", ")}`);
		this.shardQueue = new Set(shards.map((id) => new LambertWebSocketShard(this, id)));

		await this._handleSessionLimit(remaining, reset_after);

		this.createShards();
		return;
	}

	private manageShard(shard: WebSocketShard) {
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

	protected async createShards(): Promise<Boolean> {
		// If we don't have any shards to handle, return
		if (!this.shardQueue.size) return false;

		const [shard] = this.shardQueue;

		this.shardQueue.delete(shard);

		this.manageShard(shard);

		shard.sessionID = this.sessionIDs?.[shard.id] || null;

		this.shards.set(shard.id, shard);

		const handleError = (error: any) => {
			if (error && error.code && UNRECOVERABLE_CLOSE_CODES.includes(error.code)) {
				// @ts-ignore
				throw new DJSError(WSCodes[error.code]);
				// Undefined if session is invalid, error event for regular closes
			} else if (!error || error.code) {
				this.debug("Failed to connect to the gateway, requeueing...", shard);
				if (this.sessionIDs?.[shard.id]) {
					this.sessionIDs[shard.id] = null;
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
			if (!this.sessionIDs?.[shard.id]) await connect; // await for regular startup
		} catch (error) {
			handleError(error);
		}
		// If we have more shards, add a 5s delay
		if (this.shardQueue.size) {
			this.debug(
				`Shard Queue Size: ${this.shardQueue.size}; ${
					this.sessionIDs ? "immediate connect all" : "continuing in 5 seconds..."
				}`
			);
			if (!this.sessionIDs?.[shard.id]) {
				await Util.delayFor(5000); // regular startup no resuming
				await this._handleSessionLimit();
			}
			return this.createShards();
		}

		return true;
	}
}

export interface LambertWebSocketOptions extends WebSocketOptions {
	sessionIDs?: string[];
}
