import { ArgumentType } from "../ArgumentType";
import { ParseOptions } from "../ArgumentType";

export class SubCommandType extends ArgumentType {
	constructor() {
		super({ id: "subcommand" });
		this.slashType = 1;
	}

	parse({ val, cmd, trigger }: ParseOptions) {
		// TODO parse sub commands
		return cmd.getModule(val);
	}
}
