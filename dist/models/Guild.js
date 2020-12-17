"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildModel = exports.GuildSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const Snowflake_1 = require("./Snowflake");
const Channel_1 = require("./Channel");
const User_1 = require("./User");
const Activity_1 = require("./Activity");
exports.GuildSchema = new mongoose_1.Schema({
    id: { type: Snowflake_1.Snowflake, required: true, unique: true },
    name: { type: String, required: true },
    data: Object,
    afk_channel_id: Snowflake_1.Snowflake,
    afk_timeout: { type: Number, required: true },
    application_id: Snowflake_1.Snowflake,
    approximateMemberCount: Number,
    approximatePresenceCount: Number,
    banner: String,
    channels: [Channel_1.ChannelSchema],
    defaultMessageNotifications: { type: Number, required: true },
    description: String,
    discoverySplash: String,
    emojis: [
        {
            animated: Boolean,
            available: Boolean,
            id: Snowflake_1.Snowflake,
            managed: Boolean,
            name: String,
            require_colons: Boolean,
        },
    ],
    explicit_content_filter: { type: Number, required: true },
    features: [{ type: String }],
    icon: String,
    joined_at: { type: Date, required: true },
    large: { type: Boolean, required: true },
    lazy: Boolean,
    max_members: Number,
    max_video_channel_users: Number,
    member_count: Number,
    members: [
        {
            id: { type: Snowflake_1.Snowflake, required: true, unique: true },
            data: Object,
            user: User_1.UserSchema,
            deaf: { type: Boolean, required: true },
            mute: { type: Boolean, required: true },
            nick: String,
            joined_at: { type: Date, required: true },
            premium_since: Date,
            hoisted_role: Snowflake_1.Snowflake,
            roles: [{ type: Snowflake_1.Snowflake, required: true }],
        },
    ],
    mfa_level: { type: Number, required: true },
    owner_id: { type: Snowflake_1.Snowflake, required: true },
    preferred_locale: { type: String, required: true },
    premium_subscription_count: Number,
    premium_tier: Number,
    presences: [
        {
            user: {
                id: { type: Snowflake_1.Snowflake, required: true },
            },
            activites: [Activity_1.ActivitySchema],
            game: Activity_1.ActivitySchema,
            client_status: {
                mobile: String,
                desktop: String,
                web: String,
            },
            status: String,
        },
    ],
    public_updates_channel_id: Snowflake_1.Snowflake,
    region: { type: String, required: true },
    roles: [
        {
            id: { type: Snowflake_1.Snowflake, required: true },
            name: { type: String, required: true },
            color: { type: Number, required: true },
            hoist: { type: Boolean, required: true },
            managed: { type: Boolean, required: true },
            mentionable: { type: Boolean, required: true },
            position: { type: Number, required: true },
            permissions: { type: Number, required: true },
            permissions_new: { type: String, required: true },
        },
    ],
    rules_channel_id: Snowflake_1.Snowflake,
    splash: String,
    system_channel_flags: { type: Number, required: true },
    system_channel_id: Snowflake_1.Snowflake,
    unavailable: Boolean,
    vanity_url_code: String,
    verification_level: { type: Number, required: true },
    voice_states: [
        {
            channel_id: { type: Snowflake_1.Snowflake, required: true },
            user_id: { type: Snowflake_1.Snowflake, required: true },
            session_id: { type: Snowflake_1.Snowflake, required: true },
            deaf: { type: Boolean, required: true },
            mute: { type: Boolean, required: true },
            self_deaf: { type: Boolean, required: true },
            self_mute: { type: Boolean, required: true },
            self_video: { type: Boolean, required: true },
            suppress: { type: Boolean, required: true },
            self_stream: Boolean,
        },
    ],
});
exports.GuildModel = mongoose_1.default.model("Guild", exports.GuildSchema);
//# sourceMappingURL=Guild.js.map