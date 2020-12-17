"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncDatabase = void 0;
const Constants_1 = require("../structures/Constants");
const Provider_1 = require("../structures/Provider");
const { Events, WSEvents } = Constants_1.Constants;
class SyncDatabase {
    constructor(client) {
        this.client = client;
        this.SHARD_AUTHENTICATED = ({ sessionID, id }) => {
            this.data.shards({ id: id }).set({ sessionID });
        };
        this.SHARD_INVALIDATED = ({ id }) => {
            this.data.shards({ id: id }).sessionID.delete();
        };
        this.onRaw = (packet, shardID) => __awaiter(this, void 0, void 0, function* () {
            if (!packet)
                return;
            if (packet.op !== 0)
                return;
            var EVENT = packet.t;
            var shard = this.client.ws.shards.get(shardID);
            try {
                // @ts-ignore
                if (this[EVENT])
                    return yield this[EVENT](packet.d, shard);
            }
            catch (error) {
                console.error(`error syncing database for ${EVENT}`, error);
            }
        });
    }
    init() {
        this.client.on(Events.RAW, this.onRaw);
        this.client.on(Events.SHARD_AUTHENTICATED, this.SHARD_AUTHENTICATED);
        this.client.on(Events.SHARD_INVALIDATED, this.SHARD_INVALIDATED);
    }
    get data() {
        return Provider_1.Datastore(this.client, []);
    }
    READY({ user, guilds, presences }) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all([this.data.user.set(user), this.data.guilds.set(guilds)]);
        });
    }
    convertMember(member, presences = []) {
        member = Object.assign({}, member);
        var presence = presences.find((p) => p.user.id === member.user.id);
        if (!presence)
            presence = { status: "offline" };
        else
            presence = Object.assign({}, presence);
        delete presence.user;
        var user = Object.assign(Object.assign({}, member.user), { presence });
        member.id = member.user.id;
        delete member.user;
        delete member.guild_id;
        return { member, user };
    }
    GUILD_CREATE(guild, shard) {
        var users = [];
        var members = guild.members.map((member) => {
            var { member, user } = this.convertMember(member, guild.presences);
            users.push(user);
            return member;
        });
        return Promise.all([
            this.data.guilds({ id: guild.id }).set(Object.assign(Object.assign({}, guild), { members, shardID: shard.id })),
            this.data.users.set(users),
        ]);
    }
    GUILD_UPDATE(guild) {
        return this.data.guilds({ id: guild.id }).set(guild);
    }
    GUILD_DELETE(guild) {
        return this.data.guilds({ id: guild.id }).delete();
    }
    GUILD_MEMBER_ADD(member) {
        member = Object.assign({}, member);
        var { guild_id } = member;
        var { user, member } = this.convertMember(member);
        return Promise.all([
            this.data.guilds({ id: guild_id }).members.push(member),
            this.data.users({ id: user.id }).set(user),
        ]);
    }
    GUILD_MEMBER_REMOVE({ guild_id, user }) {
        return this.data.guilds({ id: guild_id }).members({ id: user.id }).delete();
    }
    GUILD_MEMBER_UPDATE(member) {
        var user, member;
        return __awaiter(this, void 0, void 0, function* () {
            // Sent when a guild member is updated. This will also fire when the user object of a guild member changes.
            member = Object.assign({}, member);
            var { guild_id } = member;
            ({ user, member } = this.convertMember(member));
            var res = yield this.data.guilds({ id: guild_id }).members({ id: member.id }).set(member);
            return Promise.all([this.data.users({ id: user.id }).set(user)]);
        });
    }
    GUILD_MEMBERS_CHUNK({ members, presences = [], chunk_count, chunk_index, guild_id }) {
        var users = [];
        var members = members.map((member) => {
            var { member, user } = this.convertMember(member, presences);
            user.push(user);
        });
        return Promise.all([this.data.guilds({ id: guild_id }).members.set(members), this.data.users.set(users)]);
    }
    GUILD_ROLE_CREATE(role) {
        role = Object.assign({}, role);
        console.log(role);
    }
    GUILD_ROLE_DELETE(role) {
        role = Object.assign({}, role);
        console.log(role);
    }
    GUILD_ROLE_UPDATE(role) {
        role = Object.assign({}, role);
        console.log(role);
    }
    INVITE_CREATE(invite) {
        invite = Object.assign({}, invite);
        console.log(invite);
    }
    INVITE_DELETE(invite) {
        invite = Object.assign({}, invite);
        console.log(invite);
    }
    PRESENCE_UPDATE(member) {
        member = Object.assign({}, member);
        var { status, client_status, activities, game, user } = member;
        return this.data.users({ id: user.id }).presence.set({ status, client_status, activities, game });
    }
    USER_UPDATE(user) {
        user = Object.assign({}, user);
        console.log(user);
    }
    destroy() {
        this.client.off(Events.RAW, this.onRaw);
        this.client.off(Events.SHARD_AUTHENTICATED, this.SHARD_AUTHENTICATED);
        this.client.off(Events.SHARD_INVALIDATED, this.SHARD_INVALIDATED);
    }
}
exports.SyncDatabase = SyncDatabase;
//# sourceMappingURL=SyncDatabase.js.map