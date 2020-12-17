"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelSchema = void 0;
const mongoose_1 = require("mongoose");
const Snowflake_1 = require("./Snowflake");
exports.ChannelSchema = new mongoose_1.Schema({
    id: { type: Snowflake_1.Snowflake, required: true },
    type: Number,
    guild_id: Snowflake_1.Snowflake,
    position: Number,
    name: String,
    topic: String,
    nsfw: Boolean,
    last_message_id: Snowflake_1.Snowflake,
    bitrate: Number,
    user_limit: Number,
    user_limit_per_user: Number,
    icon: String,
    owner_id: Snowflake_1.Snowflake,
    application_id: Snowflake_1.Snowflake,
    parent_id: Snowflake_1.Snowflake,
    last_pin_timestamp: Date,
    permission_overwrites: [
        {
            id: { type: Snowflake_1.Snowflake, required: true },
            type: { type: String, required: true },
            allow: { type: String, required: true },
            deny: { type: String, required: true },
        },
    ],
});
//# sourceMappingURL=Channel.js.map