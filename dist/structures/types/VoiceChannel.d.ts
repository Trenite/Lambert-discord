import { VoiceChannel } from "discord.js";
import { ArgumentType } from "../ArgumentType";
import { ParseOptions } from "../ArgumentType";
export declare class VoiceChannelType extends ArgumentType {
    constructor();
    parse({ val, cmd, trigger }: ParseOptions): VoiceChannel;
}
