/// <reference path="LambertWebSocketManager.d.ts" />
/// <reference path="LambertMessage.d.ts" />
/// <reference path="LambertGuild.d.ts" />
/// <reference path="LambertGuildMember.d.ts" />
/// <reference path="Registry.d.ts" />
/// <reference path="LambertDiscordClient.d.ts" />
/// <reference types="node" />
/// <reference types="discord.js" />
declare var Constants: {
    Events: {
        CLIENT_INIT: string;
        SHARD_AUTHENTICATED: string;
        SHARD_INVALIDATED: string;
        RATE_LIMIT: "rateLimit";
        CLIENT_READY: "ready";
        RESUMED: "resumed";
        GUILD_CREATE: "guildCreate";
        GUILD_DELETE: "guildDelete";
        GUILD_UPDATE: "guildUpdate";
        INVITE_CREATE: "inviteCreate";
        INVITE_DELETE: "inviteDelete";
        GUILD_UNAVAILABLE: "guildUnavailable";
        GUILD_MEMBER_ADD: "guildMemberAdd";
        GUILD_MEMBER_REMOVE: "guildMemberRemove";
        GUILD_MEMBER_UPDATE: "guildMemberUpdate";
        GUILD_MEMBER_AVAILABLE: "guildMemberAvailable";
        GUILD_MEMBER_SPEAKING: "guildMemberSpeaking";
        GUILD_MEMBERS_CHUNK: "guildMembersChunk";
        GUILD_INTEGRATIONS_UPDATE: "guildIntegrationsUpdate";
        GUILD_ROLE_CREATE: "roleCreate";
        GUILD_ROLE_DELETE: "roleDelete";
        GUILD_ROLE_UPDATE: "roleUpdate";
        GUILD_EMOJI_CREATE: "emojiCreate";
        GUILD_EMOJI_DELETE: "emojiDelete";
        GUILD_EMOJI_UPDATE: "emojiUpdate";
        GUILD_BAN_ADD: "guildBanAdd";
        GUILD_BAN_REMOVE: "guildBanRemove";
        CHANNEL_CREATE: "channelCreate";
        CHANNEL_DELETE: "channelDelete";
        CHANNEL_UPDATE: "channelUpdate";
        CHANNEL_PINS_UPDATE: "channelPinsUpdate";
        MESSAGE_CREATE: "message";
        MESSAGE_DELETE: "messageDelete";
        MESSAGE_UPDATE: "messageUpdate";
        MESSAGE_BULK_DELETE: "messageDeleteBulk";
        MESSAGE_REACTION_ADD: "messageReactionAdd";
        MESSAGE_REACTION_REMOVE: "messageReactionRemove";
        MESSAGE_REACTION_REMOVE_ALL: "messageReactionRemoveAll";
        USER_UPDATE: "userUpdate";
        PRESENCE_UPDATE: "presenceUpdate";
        VOICE_STATE_UPDATE: "voiceStateUpdate";
        VOICE_BROADCAST_SUBSCRIBE: "subscribe";
        VOICE_BROADCAST_UNSUBSCRIBE: "unsubscribe";
        TYPING_START: "typingStart";
        WEBHOOKS_UPDATE: "webhookUpdate";
        DISCONNECT: "disconnect";
        RECONNECTING: "reconnecting";
        ERROR: "error";
        WARN: "warn";
        DEBUG: "debug";
        SHARD_DISCONNECT: "shardDisconnect";
        SHARD_ERROR: "shardError";
        SHARD_RECONNECTING: "shardReconnecting";
        SHARD_READY: "shardReady";
        SHARD_RESUME: "shardResume";
        INVALIDATED: "invalidated";
        RAW: "raw";
    };
    Package: {
        [key: string]: any;
        name: string;
        version: string;
        description: string;
        author: string;
        license: string;
        main: import("fs").PathLike;
        types: import("fs").PathLike;
        homepage: string;
        keywords: string[];
        bugs: {
            url: string;
        };
        repository: {
            type: string;
            url: string;
        };
        scripts: {
            [key: string]: string;
        };
        engines: {
            [key: string]: string;
        };
        dependencies: {
            [key: string]: string;
        };
        peerDependencies: {
            [key: string]: string;
        };
        devDependencies: {
            [key: string]: string;
        };
    };
    DefaultOptions: import("discord.js").ClientOptions;
    UserAgent: string;
    Endpoints: {
        botGateway: string;
        invite: (root: string, code: string) => string;
        CDN: (root: string) => {
            Asset: (name: string) => string;
            DefaultAvatar: (id: string | number) => string;
            Emoji: (emojiID: string, format: "png" | "gif") => string;
            Avatar: (userID: string | number, hash: string, format: "default" | "jpg" | "jpeg" | "png" | "gif" | "webp", size: number) => string;
            Banner: (guildID: string | number, hash: string, format: import("discord.js").AllowedImageFormat, size: number) => string;
            Icon: (userID: string | number, hash: string, format: "default" | "jpg" | "jpeg" | "png" | "gif" | "webp", size: number) => string;
            AppIcon: (userID: string | number, hash: string, format: import("discord.js").AllowedImageFormat, size: number) => string;
            AppAsset: (userID: string | number, hash: string, format: import("discord.js").AllowedImageFormat, size: number) => string;
            GDMIcon: (userID: string | number, hash: string, format: import("discord.js").AllowedImageFormat, size: number) => string;
            Splash: (guildID: string | number, hash: string, format: import("discord.js").AllowedImageFormat, size: number) => string;
            DiscoverySplash: (guildID: string | number, hash: string, format: import("discord.js").AllowedImageFormat, size: number) => string;
            TeamIcon: (teamID: string | number, hash: string, format: import("discord.js").AllowedImageFormat, size: number) => string;
        };
    };
    WSCodes: {
        1000: "WS_CLOSE_REQUESTED";
        4004: "TOKEN_INVALID";
        4010: "SHARDING_INVALID";
        4011: "SHARDING_REQUIRED";
    };
    ShardEvents: {
        CLOSE: "close";
        DESTROYED: "destroyed";
        INVALID_SESSION: "invalidSession";
        READY: "ready";
        RESUMED: "resumed";
    };
    PartialTypes: {
        USER: "USER";
        CHANNEL: "CHANNEL";
        GUILD_MEMBER: "GUILD_MEMBER";
        MESSAGE: "MESSAGE";
        REACTION: "REACTION";
    };
    WSEvents: {
        READY: "READY";
        RESUMED: "RESUMED";
        GUILD_CREATE: "GUILD_CREATE";
        GUILD_DELETE: "GUILD_DELETE";
        GUILD_UPDATE: "GUILD_UPDATE";
        INVITE_CREATE: "INVITE_CREATE";
        INVITE_DELETE: "INVITE_DELETE";
        GUILD_MEMBER_ADD: "GUILD_MEMBER_ADD";
        GUILD_MEMBER_REMOVE: "GUILD_MEMBER_REMOVE";
        GUILD_MEMBER_UPDATE: "GUILD_MEMBER_UPDATE";
        GUILD_MEMBERS_CHUNK: "GUILD_MEMBERS_CHUNK";
        GUILD_ROLE_CREATE: "GUILD_ROLE_CREATE";
        GUILD_ROLE_DELETE: "GUILD_ROLE_DELETE";
        GUILD_ROLE_UPDATE: "GUILD_ROLE_UPDATE";
        GUILD_BAN_ADD: "GUILD_BAN_ADD";
        GUILD_BAN_REMOVE: "GUILD_BAN_REMOVE";
        GUILD_EMOJIS_UPDATE: "GUILD_EMOJIS_UPDATE";
        GUILD_INTEGRATIONS_UPDATE: "GUILD_INTEGRATIONS_UPDATE";
        CHANNEL_CREATE: "CHANNEL_CREATE";
        CHANNEL_DELETE: "CHANNEL_DELETE";
        CHANNEL_UPDATE: "CHANNEL_UPDATE";
        CHANNEL_PINS_UPDATE: "CHANNEL_PINS_UPDATE";
        MESSAGE_CREATE: "MESSAGE_CREATE";
        MESSAGE_DELETE: "MESSAGE_DELETE";
        MESSAGE_UPDATE: "MESSAGE_UPDATE";
        MESSAGE_DELETE_BULK: "MESSAGE_DELETE_BULK";
        MESSAGE_REACTION_ADD: "MESSAGE_REACTION_ADD";
        MESSAGE_REACTION_REMOVE: "MESSAGE_REACTION_REMOVE";
        MESSAGE_REACTION_REMOVE_ALL: "MESSAGE_REACTION_REMOVE_ALL";
        MESSAGE_REACTION_REMOVE_EMOJI: "MESSAGE_REACTION_REMOVE_EMOJI";
        USER_UPDATE: "USER_UPDATE";
        PRESENCE_UPDATE: "PRESENCE_UPDATE";
        TYPING_START: "TYPING_START";
        VOICE_STATE_UPDATE: "VOICE_STATE_UPDATE";
        VOICE_SERVER_UPDATE: "VOICE_SERVER_UPDATE";
        WEBHOOKS_UPDATE: "WEBHOOKS_UPDATE";
    };
    Colors: {
        DEFAULT: 0;
        WHITE: 16777215;
        AQUA: 1752220;
        GREEN: 3066993;
        BLUE: 3447003;
        YELLOW: 16776960;
        PURPLE: 10181046;
        LUMINOUS_VIVID_PINK: 15277667;
        GOLD: 15844367;
        ORANGE: 15105570;
        RED: 15158332;
        GREY: 9807270;
        NAVY: 3426654;
        DARK_AQUA: 1146986;
        DARK_GREEN: 2067276;
        DARK_BLUE: 2123412;
        DARK_PURPLE: 7419530;
        DARK_VIVID_PINK: 11342935;
        DARK_GOLD: 12745742;
        DARK_ORANGE: 11027200;
        DARK_RED: 10038562;
        DARK_GREY: 9936031;
        DARKER_GREY: 8359053;
        LIGHT_GREY: 12370112;
        DARK_NAVY: 2899536;
        BLURPLE: 7506394;
        GREYPLE: 10070709;
        DARK_BUT_NOT_BLACK: 2895667;
        NOT_QUITE_BLACK: 2303786;
    };
    Status: {
        READY: 0;
        CONNECTING: 1;
        RECONNECTING: 2;
        IDLE: 3;
        NEARLY: 4;
        DISCONNECTED: 5;
    };
    OPCodes: {
        DISPATCH: 0;
        HEARTBEAT: 1;
        IDENTIFY: 2;
        STATUS_UPDATE: 3;
        VOICE_STATE_UPDATE: 4;
        VOICE_GUILD_PING: 5;
        RESUME: 6;
        RECONNECT: 7;
        REQUEST_GUILD_MEMBERS: 8;
        INVALID_SESSION: 9;
        HELLO: 10;
        HEARTBEAT_ACK: 11;
    };
    APIErrors: import("discord.js").APIErrors;
    VoiceStatus: {
        CONNECTED: 0;
        CONNECTING: 1;
        AUTHENTICATING: 2;
        RECONNECTING: 3;
        DISCONNECTED: 4;
    };
    VoiceOPCodes: {
        IDENTIFY: 0;
        SELECT_PROTOCOL: 1;
        READY: 2;
        HEARTBEAT: 3;
        SESSION_DESCRIPTION: 4;
        SPEAKING: 5;
        HELLO: 8;
        CLIENT_CONNECT: 12;
        CLIENT_DISCONNECT: 13;
    };
    ChannelTypes: {
        TEXT: 0;
        DM: 1;
        VOICE: 2;
        GROUP: 3;
        CATEGORY: 4;
        NEWS: 5;
        STORE: 6;
    };
    ClientApplicationAssetTypes: {
        SMALL: 1;
        BIG: 2;
    };
    MessageTypes: import("discord.js").MessageType[];
    SystemMessageTypes: ("RECIPIENT_ADD" | "RECIPIENT_REMOVE" | "CALL" | "CHANNEL_NAME_CHANGE" | "CHANNEL_ICON_CHANGE" | "PINS_ADD" | "GUILD_MEMBER_JOIN" | "USER_PREMIUM_GUILD_SUBSCRIPTION" | "USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_1" | "USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_2" | "USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_3" | "CHANNEL_FOLLOW_ADD" | "GUILD_DISCOVERY_DISQUALIFIED" | "GUILD_DISCOVERY_REQUALIFIED")[];
    ActivityTypes: import("discord.js").ActivityType[];
    ExplicitContentFilterLevels: import("discord.js").ExplicitContentFilterLevel[];
    DefaultMessageNotifications: import("discord.js").DefaultMessageNotifications[];
    VerificationLevels: import("discord.js").VerificationLevel[];
    MembershipStates: "INVITED" | "ACCEPTED";
};
export { Constants };
