import { ArgumentType } from "../ArgumentType";
import { ParseOptions } from "../ArgumentType";
import { ERRORS, LambertError } from "../LambertError";

export class IntegerType extends ArgumentType {
	constructor() {
		super({ id: "integer" });
		this.slashType = 4;
	}

	parse({ val, cmd, trigger }: ParseOptions) {
		const number = parseInt(val);
		if (isNaN(number) || val == null) throw new LambertError(ERRORS.NOT_A_NUMBER, val);
		return number;
	}
}
