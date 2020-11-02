import { Constants } from "../structures/Constants";
import { LambertDiscordClient } from "../client/LambertDiscordClient";
const { Events, WSEvents } = Constants;

export class SyncDatabase {
	constructor(public client: LambertDiscordClient) {
		client.on(Events.RAW, this.onRaw);
	}

	onRaw(packet: any) {
		if (!packet) return;
		if (packet.op !== 0) return;

		console.log(packet);

		switch (packet.t) {
			case WSEvents.GUILD_CREATE:
				break;
			default:
				return;
		}
	}

	destroy() {
		this.client.off(Events.RAW, this.onRaw);
	}
}
