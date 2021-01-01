// @ts-nocheck

import { WebSocketShard, WebSocketManager } from "discord.js";
import { Constants } from "./Constants";
import { LambertWebSocketManager } from "./LambertWebSocketManager";
const { WSEvents, ShardEvents, OPCodes, WSCodes, Status } = Constants;

export class LambertWebSocketShard extends WebSocketShard {
	constructor(manager: LambertWebSocketManager, id: number) {
		super(manager, id);
	}

	public destroy(opts: any) {
		if (opts && opts.keepalive) {
			setTimeout(() => {
				super.destroy(opts);
			}, 1000 * 30);
		} else {
			super.destroy(opts);
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
