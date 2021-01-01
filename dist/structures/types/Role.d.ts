import { Role } from "discord.js";
import { ArgumentType } from "../ArgumentType";
import { ParseOptions } from "../ArgumentType";
export declare class RoleType extends ArgumentType {
    constructor();
    parse({ val, cmd, trigger }: ParseOptions): Role;
}
