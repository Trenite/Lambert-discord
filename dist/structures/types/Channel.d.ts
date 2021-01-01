import { Channel, Collection } from "discord.js";
import { ArgumentType } from "../ArgumentType";
import { ParseOptions } from "../ArgumentType";
export declare class ChannelType extends ArgumentType {
    constructor();
    parse({ val, cmd, trigger }: ParseOptions): Channel;
}
export declare function getMostSimilarCache(val: string, cache: Collection<string, any>, prop: (x: any) => string): any;
