import { Schema } from "mongoose";
import Snowflake from "./Snowflake";

export const ActivitySchema: Schema = new Schema({
	created_at: { type: Number },
	type: { type: Number },
	id: String,
	name: { type: String },
	url: String,
	timestamps: [{ start: Number, end: Number }],
	application_id: Snowflake,
	details: String,
	state: String,
	emoji: {
		name: { type: String },
		id: Snowflake,
		animated: Boolean,
	},
	party: {
		id: Snowflake,
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
