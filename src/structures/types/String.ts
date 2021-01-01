import { ArgumentType } from "../ArgumentType";
import { ParseOptions } from "../ArgumentType";
import { ERRORS, LambertError } from "../LambertError";

export class StringType extends ArgumentType {
	constructor() {
		super({ id: "string" });
		this.slashType = 3;
	}

	parse({ val, cmd, trigger }: ParseOptions) {
		if (typeof val !== "string") throw new LambertError(ERRORS.NOT_A_STRING, val);
		return val;
	}
}
