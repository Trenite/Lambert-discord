import { WebSocketShard, WebSocketManager } from "discord.js";
import { Constants } from "../../structures/Constants";
import { getShardId } from "../../util/discord";
import { LambertWebSocketManager } from "./LambertWebSocketManager";
const { WSEvents, ShardEvents, OPCodes, WSCodes, Status } = Constants;

// @ts-ignore
export class LambertWebSocketShard extends WebSocketShard {
	// @ts-ignore
	public manager: LambertWebSocketManager;

	constructor(manager: LambertWebSocketManager, id: number) {
		super(<WebSocketManager>manager, id);
	}

	public destroy(opts: any) {
		if (opts && opts.keepalive) {
			setTimeout(() => {
				// @ts-ignore
				super.destroy(opts);
			}, 1000 * 30);
		} else {
			// @ts-ignore
			super.destroy(opts);
		}
	}

	// @ts-ignore
	private onPacket(packet: any): void {
		if (!packet) {
			// @ts-ignore
			this.debug(`Received broken packet: '${packet}'.`);
			return;
		}

		switch (packet.t) {
			case WSEvents.RESUMED:
				this.status = Status.READY;

				// @ts-ignore
				this.emit("allReady");
				break;
		}

		switch (packet.op) {
			case OPCodes.INVALID_SESSION:
				// this.identifyNew();
				break;
		}

		// @ts-ignore
		return super.onPacket(packet);
	}
}
