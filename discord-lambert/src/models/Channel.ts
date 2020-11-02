import { Schema } from "mongoose";
import Snowflake from "./Snowflake";

export const ChannelSchema: Schema = new Schema({
	id: { type: Snowflake, required: true },
	type: Number,
	guild_id: Snowflake,
	position: Number,
	name: String,
	topic: String,
	nsfw: Boolean,
	last_message_id: Snowflake,
	bitrate: Number,
	user_limit: Number,
	user_limit_per_user: Number,
	icon: String,
	owner_id: Snowflake,
	application_id: Snowflake,
	parent_id: Snowflake,
	last_pin_timestamp: Date,
	permission_overwrites: [
		{
			id: { type: Snowflake, required: true },
			type: { type: String, required: true },
			allow: { type: String, required: true },
			deny: { type: String, required: true },
		},
	],
});
