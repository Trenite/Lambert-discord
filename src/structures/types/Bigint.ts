import { ArgumentType } from "../ArgumentType";
import { ParseOptions } from "../ArgumentType";
import { ERRORS, LambertError } from "../LambertError";

export class BigIntType extends ArgumentType {
	constructor() {
		super({ id: "bigint" });
		this.slashType = 4;
	}

	parse({ val, cmd, trigger }: ParseOptions) {
		try {
			return BigInt(val);
		} catch (error) {
			throw new LambertError(ERRORS.NOT_A_BIGINT, val);
		}
	}
}
