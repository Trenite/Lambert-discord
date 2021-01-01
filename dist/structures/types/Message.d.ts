import { Message } from "discord.js";
import { ArgumentType } from "../ArgumentType";
import { ParseOptions } from "../ArgumentType";
export declare class MessageType extends ArgumentType {
    constructor();
    parse({ val, cmd, trigger }: ParseOptions): Promise<Message>;
}
