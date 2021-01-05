import { inherits } from "util";
import { Guild, Base } from "discord.js";
import { Datastore, ProviderCache } from "lambert-db";
import { DatastoreInterface } from "lambert-db/dist/Datastore";

declare module "discord.js" {
	interface Guild {
		_prefix: ProviderCache;
		_locale: ProviderCache;
		prefix: string;
		data: DatastoreInterface;
		init(): Promise<any>;
		destroy(): Promise<any>;
		_patch(data: any): void;
	}
}

export interface LambertGuild extends Guild {}

export class LambertGuild {
	_patch(data: any) {
		this.init();
		return oldPatch.call(this, data);
	}

	async init() {
		this._prefix = this.data.prefix.__getProvider().cache;
		this._locale = this.data.locale.__getProvider().cache;
		return this._prefix.init();
	}

	get prefix() {
		return this._prefix.get() || this.client.options.commandPrefix;
	}

	// get locale() {
	// 	return this._locale.get() || this.client.options.defaultLocale;
	// }

	get language() {
		return;
	}

	public get data() {
		return Datastore(this.client.db, [{ name: "guilds", filter: { id: this.id } }, { name: "data" }]);
	}

	async destroy() {
		return this._prefix.destroy();
	}
}

const oldPatch = Guild.prototype._patch;
Guild.prototype._patch = LambertGuild.prototype._patch;

inherits(Guild, Base);
inherits(Guild, LambertGuild);

// const guilds: any[] = await this.client.data.guilds({ shardID: this.client.options.shards }).get();
