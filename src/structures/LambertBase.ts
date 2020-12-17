import { Base, Structures } from "discord.js";
import { LambertDiscordClient } from "../client/LambertDiscordClient";

export class LambertBase extends Base {
	constructor(client: LambertDiscordClient) {
		super(client);
	}
}

Structures.extend("Base", (base) => {
	return LambertBase;
});
