import { Structures, User } from "discord.js";
import { LambertDiscordClient } from "../client/LambertDiscordClient";
import { Datastore } from "./Datastore";
import { Mixin } from "ts-mixer";
import { Auth } from "./Auth";

export class LambertUser extends Mixin(User, Auth) {
	constructor(public client: LambertDiscordClient, data: any) {
		super(client, data);
	}

	public get data() {
		return Datastore(this.client, [{ name: "users", filter: { id: this.id } }]);
	}
}

Structures.extend("User", (User) => {
	return LambertUser;
});
