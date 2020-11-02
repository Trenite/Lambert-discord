import { SchemaType, Schema } from "mongoose";

export default class Snowflake extends SchemaType {
	constructor(key: string, options?: any) {
		super(key, options, "Snowflake");
	}

	cast(val: string) {
		// TODO: check val
		if (typeof val !== "string") throw new Error("Snowflake must be a string");
		return val;
	}
}

// @ts-ignore
Schema.Types["Snowflake"] = Snowflake;
