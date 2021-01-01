import { TextChannel } from "discord.js";
import { ArgumentType } from "../ArgumentType";
import { ParseOptions } from "../ArgumentType";
export declare class TextChannelType extends ArgumentType {
    constructor();
    parse({ val, cmd, trigger }: ParseOptions): TextChannel;
}
