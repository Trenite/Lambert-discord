import { GuildMember } from "discord.js";
import { ArgumentType } from "../ArgumentType";
import { ParseOptions } from "../ArgumentType";
export declare class MemberType extends ArgumentType {
    constructor();
    parse({ val, cmd, trigger }: ParseOptions): Promise<GuildMember>;
}
