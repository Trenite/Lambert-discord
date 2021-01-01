import { ApplicationCommandOptionType } from "./ApplicationCommand";
import { Command } from "./Command";
import { CommandTrigger } from "./CommandInteraction";
import { Module } from "./Module";
export declare type ParseOptions = {
    val: string;
    trigger: CommandTrigger;
    cmd: Command;
};
export declare abstract class ArgumentType extends Module {
    slashType: ApplicationCommandOptionType;
    abstract parse({ val, trigger, cmd }: ParseOptions): any;
}
