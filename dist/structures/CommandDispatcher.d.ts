import { Message } from "discord.js";
import { Command } from "./Command";
import { LambertDiscordClient } from "./LambertDiscordClient";
import { CommandInteraction, CommandTrigger } from "./CommandInteraction";
import { Argument } from "./Argument";
export declare class CommandDispatcher {
    private client;
    private mention;
    constructor(client: LambertDiscordClient);
    init(): void;
    onInteraction: (interaction: CommandInteraction) => Promise<void>;
    onMessage: (message: Message) => Promise<void>;
    checkCmd({ cmd, trigger, args, }: {
        cmd: Command;
        trigger: CommandTrigger;
        args: string | Record<string, Argument>;
    }): Promise<void>;
    destroy(): void;
}
