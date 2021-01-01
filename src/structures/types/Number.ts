import { ArgumentType } from "../ArgumentType";
import { ParseOptions } from "../ArgumentType";
import { ERRORS, LambertError } from "../LambertError";

export class NumberType extends ArgumentType {
	constructor() {
		super({ id: "number" });
		this.slashType = 3;
	}

	parse({ val, cmd, trigger }: ParseOptions) {
		const number = Number(val);
		if (isNaN(number) || val == null) throw new LambertError(ERRORS.NOT_A_NUMBER, val);
		return number;
	}
}
