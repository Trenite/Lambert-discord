import { Constants } from "../structures/Constants";
import { LambertDiscordClient } from "../client/LambertDiscordClient";
import { Datastore } from "../structures/Provider";
import { LambertWebSocketShard } from "../client/websocket/LambertWebSocketShard";
const { Events, WSEvents } = Constants;

export class SyncDatabase {
	constructor(public client: LambertDiscordClient) {}

	init() {
		this.client.on(Events.RAW, this.onRaw);
		this.client.on(Events.SHARD_AUTHENTICATED, this.SHARD_AUTHENTICATED);
		this.client.on(Events.SHARD_INVALIDATED, this.SHARD_INVALIDATED);
	}

	public get data() {
		return Datastore(this.client, []);
	}

	SHARD_AUTHENTICATED = ({ sessionID, id }: LambertWebSocketShard) => {
		this.data.shards({ id: id }).set({ sessionID });
	};

	SHARD_INVALIDATED = ({ id }: LambertWebSocketShard) => {
		this.data.shards({ id: id }).sessionID.delete();
	};

	async READY({ user, guilds, presences }: any) {
		await Promise.all([this.data.user.set(user), this.data.guilds.set(guilds)]);
	}

	convertMember(member: any, presences: any[] = []) {
		member = { ...member };

		var presence = presences.find((p: any) => p.user.id === member.user.id);
		if (!presence) presence = { status: "offline" };
		else presence = { ...presence };
		delete presence.user;
		var user = { ...member.user, presence };

		member.id = member.user.id;
		delete member.user;
		delete member.guild_id;

		return { member, user };
	}

	GUILD_CREATE(guild: any, shard: LambertWebSocketShard) {
		var users: any[] = [];
		var members = guild.members.map((member: any) => {
			var { member, user } = this.convertMember(member, guild.presences);
			users.push(user);
			return member;
		});

		return Promise.all([
			this.data.guilds({ id: guild.id }).set({ ...guild, members, shardID: shard.id }),
			this.data.users.set(users),
		]);
	}

	GUILD_UPDATE(guild: any) {
		return this.data.guilds({ id: guild.id }).set(guild);
	}

	GUILD_DELETE(guild: any) {
		return this.data.guilds({ id: guild.id }).delete();
	}

	GUILD_MEMBER_ADD(member: any) {
		member = { ...member };
		var { guild_id } = member;
		var { user, member } = this.convertMember(member);

		return Promise.all([
			this.data.guilds({ id: guild_id }).members.push(member),
			this.data.users({ id: user.id }).set(user),
		]);
	}

	GUILD_MEMBER_REMOVE({ guild_id, user }: any) {
		return this.data.guilds({ id: guild_id }).members({ id: user.id }).delete();
	}

	async GUILD_MEMBER_UPDATE(member: any) {
		// Sent when a guild member is updated. This will also fire when the user object of a guild member changes.
		member = { ...member };
		var { guild_id } = member;
		var { user, member } = this.convertMember(member);

		var res = await this.data.guilds({ id: guild_id }).members({ id: member.id }).set(member);
		return Promise.all([this.data.users({ id: user.id }).set(user)]);
	}

	GUILD_MEMBERS_CHUNK({ members, presences = [], chunk_count, chunk_index, guild_id }: any) {
		var users: any[] = [];
		var members = members.map((member: any) => {
			var { member, user } = this.convertMember(member, presences);
			user.push(user);
		});

		return Promise.all([this.data.guilds({ id: guild_id }).members.set(members), this.data.users.set(users)]);
	}

	GUILD_ROLE_CREATE(role: any) {
		role = { ...role };
		console.log(role);
	}
	GUILD_ROLE_DELETE(role: any) {
		role = { ...role };
		console.log(role);
	}
	GUILD_ROLE_UPDATE(role: any) {
		role = { ...role };
		console.log(role);
	}

	INVITE_CREATE(invite: any) {
		invite = { ...invite };
		console.log(invite);
	}
	INVITE_DELETE(invite: any) {
		invite = { ...invite };
		console.log(invite);
	}

	PRESENCE_UPDATE(member: any) {
		member = { ...member };
		var { status, client_status, activities, game, user } = member;

		return this.data.users({ id: user.id }).presence.set({ status, client_status, activities, game });
	}

	USER_UPDATE(user: any) {
		user = { ...user };
		console.log(user);
	}

	onRaw = async (packet: any, shardID: number) => {
		if (!packet) return;
		if (packet.op !== 0) return;

		var EVENT: string = packet.t;
		var shard = this.client.ws.shards.get(shardID);

		try {
			// @ts-ignore
			if (this[EVENT]) return await this[EVENT](packet.d, shard);
		} catch (error) {
			console.error(`error syncing database for ${EVENT}`, error);
		}
	};

	destroy() {
		this.client.off(Events.RAW, this.onRaw);
		this.client.off(Events.SHARD_AUTHENTICATED, this.SHARD_AUTHENTICATED);
		this.client.off(Events.SHARD_INVALIDATED, this.SHARD_INVALIDATED);
	}
}
