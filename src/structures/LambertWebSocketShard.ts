// @ts-nocheck
import { WebSocketShard as WSShard } from "discord.js";
import { Constants } from "./Constants";
const { WSEvents, ShardEvents, OPCodes, WSCodes, Status } = Constants;

try {
	var WebSocketShard = require("../../../discord.js/src/client/websocket/WebSocketShard");
} catch (error) {
	var WebSocketShard = require("../../node_modules/discord.js/src/client/websocket/WebSocketShard");
}

export interface LambertWebSocketShard extends WSShard {}

export class LambertWebSocketShard {
	public sessionID: string;

	public destroy(opts: any) {
		if (opts && opts.keepalive) {
			setTimeout(() => {
				destroy.call(this, opts);
			}, 1000 * 30);
		} else {
			destroy.call(this, opts);
		}
	}

	private onPacket(packet: any): void {
		if (!packet) {
			this.debug(`Received broken packet: '${packet}'.`);
			return;
		}

		switch (packet.t) {
			case WSEvents.RESUMED:
				this.status = Status.READY;

				this.emit("allReady");
				break;
		}

		switch (packet.op) {
			case OPCodes.INVALID_SESSION:
				// this.identifyNew();
				break;
		}

		return super.onPacket(packet);
	}
}

const destroy = WebSocketShard.prototype.destroy;
WebSocketShard.prototype.destroy = LambertWebSocketShard.prototype.destroy;
