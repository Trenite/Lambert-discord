import { Command } from "./Command";
import { ArgumentType } from "./ArgumentType";
export declare class Argument {
    command: Command;
    type: ArgumentType;
    id: string;
    description: string;
    title?: string;
    max?: number;
    min?: number;
    default?: any;
    wait?: number;
    required?: boolean;
    constructor(command: Command, data: ArgumentOptions);
}
export declare type valueOrFunction<B, T> = (any: B) => T | T;
export declare type ArgumentOptions = {
    id: string;
    description: string;
    title?: string;
    type: "bigint" | "boolean" | "categorychannel" | "channel" | "command" | "integer" | "member" | "message" | "number" | "role" | "string" | "subcommand" | "textchannel" | "union" | "user" | "voicechannel";
    max?: number;
    min?: number;
    default?: any | (string | number)[];
    wait?: number;
    required?: boolean;
};
