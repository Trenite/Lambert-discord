"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
const mongoose_1 = require("mongoose");
const Snowflake_1 = require("./Snowflake");
exports.UserSchema = new mongoose_1.Schema({
    id: { type: Snowflake_1.Snowflake, required: true, unique: true },
    username: { type: String, required: true },
    discriminator: { type: String, required: true },
    avatar: String,
    bot: Boolean,
    system: Boolean,
    mfa_enabled: Boolean,
    verified: Boolean,
    locale: String,
    email: String,
    flags: Number,
    premium_type: Number,
    public_flags: Number,
});
//# sourceMappingURL=User.js.map