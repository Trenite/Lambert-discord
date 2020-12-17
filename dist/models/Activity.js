"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivitySchema = void 0;
const mongoose_1 = require("mongoose");
const Snowflake_1 = require("./Snowflake");
exports.ActivitySchema = new mongoose_1.Schema({
    created_at: { type: Number },
    type: { type: Number },
    id: String,
    name: { type: String },
    url: String,
    timestamps: [{ start: Number, end: Number }],
    application_id: Snowflake_1.Snowflake,
    details: String,
    state: String,
    emoji: {
        name: { type: String },
        id: Snowflake_1.Snowflake,
        animated: Boolean,
    },
    party: {
        id: Snowflake_1.Snowflake,
        size: [Number],
    },
    assets: {
        large_image: String,
        large_text: String,
        small_image: String,
        small_text: String,
    },
    secrets: {
        join: String,
        spectate: String,
        match: String,
    },
    instance: Boolean,
    flags: Number,
});
//# sourceMappingURL=Activity.js.map