import { CategoryChannel } from "discord.js";
import { ArgumentType } from "../ArgumentType";
import { ParseOptions } from "../ArgumentType";
export declare class CategoryChannelType extends ArgumentType {
    constructor();
    parse({ val, cmd, trigger }: ParseOptions): CategoryChannel;
}
