import { Command } from "./Command";
import { Handler } from "./Handler";
import { Collection } from "discord.js";
import { Registry } from "./Registry";
import { LambertDiscordClient } from "..";
import { ApplicationCommand } from "./ApplicationCommand";
export interface CommandHandlerOptions {
    slashCommands?: boolean;
    registry: Registry;
}
export declare class CommandHandler extends Handler<Command> {
    readonly categories: Collection<string, Command[]>;
    options: CommandHandlerOptions;
    registry: Registry;
    client: LambertDiscordClient;
    slashCommands: ApplicationCommand[];
    constructor(opts: CommandHandlerOptions);
    init(): Promise<void>;
    register(mod: Command): Promise<Command>;
    remove(id: string): Promise<void>;
}
