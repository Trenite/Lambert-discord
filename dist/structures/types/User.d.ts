import { User } from "discord.js";
import { ArgumentType } from "../ArgumentType";
import { ParseOptions } from "../ArgumentType";
export declare class UserType extends ArgumentType {
    constructor();
    parse({ val, cmd, trigger }: ParseOptions): Promise<User>;
}
