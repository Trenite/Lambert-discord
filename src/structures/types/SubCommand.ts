import { ArgumentType } from "../ArgumentType";
import { ParseOptions } from "../ArgumentType";

export class SubCommandType extends ArgumentType {
	constructor() {
		super({ id: "subcommand" });
		this.slashType = 1;
	}

	async parse({ val, cmd, trigger }: ParseOptions) {
		// TODO parse sub commands and their args

		const split = val.split(" ");
		const subcommandName = split[0];
		const subcommand = cmd.getModule(subcommandName);
		const subargs = await subcommand.getArgs({ trigger, args: split.slice(1).join(" ") });
		return { subargs, subcommand };
	}
}
