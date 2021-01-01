import { ApplicationCommandOptionType } from "./ApplicationCommand";
import { Command } from "./Command";
import { CommandTrigger } from "./CommandInteraction";
import { LambertMessage } from "./LambertMessage";
import { Module } from "./Module";

export type ParseOptions = { val: string; trigger: CommandTrigger; cmd: Command };

export abstract class ArgumentType extends Module {
	public slashType: ApplicationCommandOptionType;
	abstract parse({ val, trigger, cmd }: ParseOptions): any;
}
