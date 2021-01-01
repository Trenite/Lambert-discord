import { Message, StringResolvable, MessageOptions } from "discord.js";
import { Command } from "./Command";
import { AckOptions } from "./CommandInteraction";
declare module "discord.js" {
    interface Message {
        prefix?: string;
        cmdName?: string;
        cmd?: Command;
        ack(options?: AckOptions, content?: StringResolvable, msg?: MessageOptions): Promise<any>;
    }
}
export interface LambertMessage extends Message {
}
export declare class LambertMessage {
    private acknowledged;
    ack(options?: AckOptions, content?: StringResolvable, msg?: MessageOptions): Promise<Message | Message[]>;
}
