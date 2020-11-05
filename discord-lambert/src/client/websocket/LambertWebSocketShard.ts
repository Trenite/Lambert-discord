import { WebSocketShard, WebSocketManager } from "discord.js";
import { Constants } from "../../structures/Constants";
import { LambertWebSocketManager } from "./LambertWebSocketManager";
const { WSEvents, ShardEvents, OPCodes, WSCodes, Status } = Constants;

export class LambertWebSocketShard extends WebSocketShard {
	constructor(manager: LambertWebSocketManager, id: number) {
		super(<WebSocketManager>manager, id);
	}

	onPacket(packet: any): void {
		if (!packet) {
			this.debug(`Received broken packet: '${packet}'.`);
			return;
		}

		switch (packet.t) {
			case WSEvents.RESUMED:
				this.status = Status.READY;

				this.emit(ShardEvents.ALL_READY);
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
