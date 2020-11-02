import mongoose, { Schema, Document } from "mongoose";
import Snowflake from "./Snowflake";
import { ChannelSchema } from "./Channel";
import { UserSchema } from "./User";
import { ActivitySchema } from "./Activity";

export const GuildSchema: Schema = new Schema({
	afk_channel_id: Snowflake,
	afk_timeout: { type: Number, required: true },
	application_id: Snowflake,
	approximateMemberCount: Number,
	approximatePresenceCount: Number,
	banner: String,
	channels: [ChannelSchema],
	defaultMessageNotifications: { type: Number, required: true },
	description: String,
	discoverySplash: String,
	emojis: [
		{
			animated: Boolean,
			available: Boolean,
			id: Snowflake,
			managed: Boolean,
			name: String,
			require_colons: Boolean,
		},
	],
	explicit_content_filter: { type: Number, required: true },
	features: [{ type: String }],
	icon: String,
	id: { type: Snowflake, required: true },
	joined_at: { type: Date, required: true },
	large: { type: Boolean, required: true },
	lazy: Boolean,
	max_members: Number,
	max_video_channel_users: Number,
	member_count: Number,
	members: [
		{
			deaf: { type: Boolean, required: true },
			mute: { type: Boolean, required: true },
			nick: String,
			joined_at: { type: Date, required: true },
			premium_since: Date,
			hoisted_role: Snowflake,
			roles: [{ type: Snowflake, required: true }],
			user: UserSchema,
		},
	],
	mfa_level: { type: Number, required: true },
	name: { type: String, required: true },
	owner_id: { type: Snowflake, required: true },
	preferred_locale: { type: String, required: true },
	premium_subscription_count: Number,
	premium_tier: Number,
	presences: [
		{
			user: {
				id: { type: Snowflake, required: true },
			},
			activites: [ActivitySchema],
			game: ActivitySchema,
			client_status: {
				mobile: String,
				desktop: String,
				web: String,
			},
			status: String,
		},
	],
	public_updates_channel_id: Snowflake,
	region: { type: String, required: true },
	roles: [
		{
			id: { type: Snowflake, required: true },
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
	rules_channel_id: Snowflake,
	splash: String,
	system_channel_flags: { type: Number, required: true },
	system_channel_id: Snowflake,
	unavailable: Boolean,
	vanity_url_code: String,
	verification_level: { type: Number, required: true },
	voice_states: [
		{
			channel_id: { type: Snowflake, required: true },
			user_id: { type: Snowflake, required: true },
			session_id: { type: Snowflake, required: true },
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

export const GuildModel = mongoose.model("Guild", GuildSchema);
