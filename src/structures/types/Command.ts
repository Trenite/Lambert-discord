import { ArgumentType } from "../ArgumentType";
import { ParseOptions } from "../ArgumentType";
import { ERRORS, LambertError } from "../LambertError";

export class CommandType extends ArgumentType {
	constructor() {
		super({ id: "command" });
		this.slashType = 3;
	}

	parse({ val, cmd, trigger }: ParseOptions) {
		val = val.toLowerCase();

		let command = trigger.client.registry.commands.getModule(val);

		if (!command) throw new LambertError(ERRORS.NOT_A_COMMAND, val);
		return command;
	}
}
