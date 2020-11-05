import { Schema } from "mongoose";
import Snowflake from "./Snowflake";

export const UserSchema: Schema = new Schema({
	id: { type: Snowflake, required: true, unique: true },
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
