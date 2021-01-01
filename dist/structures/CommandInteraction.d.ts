import { Base, GuildMember, TextChannel, Guild, StringResolvable, MessageOptions, Message } from "discord.js";
import { Argument } from "./Argument";
import { Command } from "./Command";
import { LambertDiscordClient } from "./LambertDiscordClient";
export declare type CommandTrigger = Message | CommandInteraction;
export interface Interaction {
    id: string;
    type: InteractionType;
    guild_id: string;
    channel_id: string;
    member: GuildMember;
    token: string;
    version: number;
    data: ApplicationCommandInteractionData;
}
export declare type InteractionType = 1 | 2;
export interface ApplicationCommandInteractionData {
    id: string;
    name: string;
    options: ApplicationCommandInteractionDataOption[];
}
export interface ApplicationCommandInteractionDataOption {
    name: string;
    value: any;
    options: ApplicationCommandInteractionDataOption[];
}
export interface AckOptions {
    showUsage?: boolean;
    dm?: boolean;
    replyIfError?: boolean;
}
export declare class CommandInteraction extends Base {
    private data;
    channel: TextChannel;
    guild: Guild;
    id: string;
    member: GuildMember;
    token: string;
    type: InteractionType;
    started: number;
    command: Command;
    acknowledged: boolean;
    args: Record<string, Argument>;
    constructor(client: LambertDiscordClient, data: Interaction);
    get valid(): boolean;
    _patch(data: Interaction): void;
    getArgs(): Promise<Record<string, Argument>>;
    ack(options?: AckOptions, content?: StringResolvable, msg?: MessageOptions): Promise<any>;
    reply(content: StringResolvable, options?: MessageOptions): Promise<any>;
}
