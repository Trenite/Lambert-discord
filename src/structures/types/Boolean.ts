import { ArgumentType } from "../ArgumentType";
import { ParseOptions } from "../ArgumentType";
import { ERRORS, LambertError } from "../LambertError";

export class BooleanType extends ArgumentType {
	constructor() {
		super({ id: "boolean" });
		this.slashType = 5;
	}

	parse({ val, cmd, trigger }: ParseOptions) {
		val = typeof val === "string" ? val.toLowerCase() : val;
		const yes = ["yes", "y", "true", true];
		const no = ["no", "n", "false", false];

		if (yes.includes(val)) {
			return true;
		}
		if (no.includes(val)) {
			return false;
		}

		throw new LambertError(ERRORS.NOT_A_BOOLEAN, val);
	}
}
