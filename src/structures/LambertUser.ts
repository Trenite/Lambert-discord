import { User, Base } from "discord.js";
import { Auth } from "./Auth";
import { Datastore } from "lambert-db";
import { inherits } from "util";

export interface LambertUser extends User {}
export interface LambertUser extends Auth {}

export class LambertUser {
	public get data() {
		return Datastore(this.client.db, [{ name: "users", filter: { id: this.id } }]);
	}
}

inherits(User, Auth);
inherits(User, LambertUser);
inherits(User, Base);
