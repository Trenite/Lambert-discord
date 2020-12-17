import { LambertDiscordClient } from "../client/LambertDiscordClient";
import { LambertWebSocketShard } from "../client/websocket/LambertWebSocketShard";
export declare class SyncDatabase {
    client: LambertDiscordClient;
    constructor(client: LambertDiscordClient);
    init(): void;
    get data(): import("../structures/Provider").DatastoreType;
    SHARD_AUTHENTICATED: ({ sessionID, id }: LambertWebSocketShard) => void;
    SHARD_INVALIDATED: ({ id }: LambertWebSocketShard) => void;
    READY({ user, guilds, presences }: any): Promise<void>;
    convertMember(member: any, presences?: any[]): {
        member: any;
        user: any;
    };
    GUILD_CREATE(guild: any, shard: LambertWebSocketShard): Promise<[any, any]>;
    GUILD_UPDATE(guild: any): any;
    GUILD_DELETE(guild: any): any;
    GUILD_MEMBER_ADD(member: any): Promise<[any, any]>;
    GUILD_MEMBER_REMOVE({ guild_id, user }: any): any;
    GUILD_MEMBER_UPDATE(member: any): Promise<any[]>;
    GUILD_MEMBERS_CHUNK({ members, presences, chunk_count, chunk_index, guild_id }: any): Promise<[any, any]>;
    GUILD_ROLE_CREATE(role: any): void;
    GUILD_ROLE_DELETE(role: any): void;
    GUILD_ROLE_UPDATE(role: any): void;
    INVITE_CREATE(invite: any): void;
    INVITE_DELETE(invite: any): void;
    PRESENCE_UPDATE(member: any): any;
    USER_UPDATE(user: any): void;
    onRaw: (packet: any, shardID: number) => Promise<any>;
    destroy(): void;
}
//# sourceMappingURL=SyncDatabase.d.ts.map