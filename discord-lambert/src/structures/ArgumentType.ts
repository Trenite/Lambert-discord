import { LambertMessage } from "./LambertMessage";

export class ArgumentType {
	constructor(public readonly name: string) {}

	validate(val: string, msg: LambertMessage) {}
}
