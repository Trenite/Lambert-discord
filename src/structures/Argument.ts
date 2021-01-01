import { Command } from "./Command";
import { ArgumentType } from "./ArgumentType";

export class Argument {
	public type: ArgumentType;
	public id: string;
	public description: string;
	public title?: string;
	public max?: number;
	public min?: number;
	public default?: any;
	public wait?: number;
	public required?: boolean;

	constructor(public command: Command, data: ArgumentOptions) {
		this.id = data.id;
		this.type = <ArgumentType>command.client.registry.types.getModule(data.type);
		if (!this.type) throw new Error(`ArgumentType ${data.type} not found for command ${command.id}`);
		this.title = data.title;
		this.max = data.max;
		this.min = data.min;
		this.description = data.description;
		this.wait = data.wait;
		this.required = data.required;

		if (this.type.id === "union") {
			if (!data.default) throw new Error("Union type must have a default value");
			if (!Array.isArray(data.default)) throw new Error("default value for unions must be an array of values");
			data.default = data.default.map((x) => {
				if (typeof x === "number") return parseInt(`${x}`);
				if (typeof x === "string") return x;
				throw new Error("All values in union default array must be an integer or a string");
			});
		}
		this.default = data.default;
	}
}

export type valueOrFunction<B, T> = (any: B) => T | T;

export type ArgumentOptions = {
	id: string;
	description: string;
	title?: string;
	type:
		| "bigint"
		| "boolean"
		| "categorychannel"
		| "channel"
		| "command"
		| "integer"
		| "member"
		| "message"
		| "number"
		| "role"
		| "string"
		| "subcommand"
		| "textchannel"
		| "union"
		| "user"
		| "voicechannel";
	max?: number;
	min?: number;
	default?: any | (string | number)[];
	wait?: number;
	required?: boolean;
};
