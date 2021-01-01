import { MessageOptions } from "discord.js";
import { LambertDiscordClient } from "./LambertDiscordClient";
import { ArgumentType } from "./ArgumentType";
import { Command } from "./Command";
import { CommandDispatcher } from "./CommandDispatcher";
import { CommandHandler, CommandHandlerOptions } from "./CommandHandler";
import { Handler } from "./Handler";
import { Inhibitor } from "./Inhibitor";
import { MessageTransformer } from "./MessageTransformers";
export declare type MessageEmbedTypes = "error" | "warn" | "success" | "wait" | "noembed";
declare module "discord.js" {
    interface MessageOptions {
        type?: MessageEmbedTypes;
    }
}
export declare type RegistryOptions = {
    client: LambertDiscordClient;
    commands?: CommandHandlerOptions;
};
export declare class Registry {
    client: LambertDiscordClient;
    dispatcher: CommandDispatcher;
    commands: CommandHandler;
    inhibitors: Handler<Inhibitor>;
    events: Handler<Command>;
    types: Handler<ArgumentType>;
    messageTransformers: MessageTransformer[];
    constructor({ client, commands }: RegistryOptions);
    init(): Promise<[void, void, void, void, void]>;
    destroy(): Promise<[void, void, void, void, void]>;
    registerDefault(): Promise<[void, void, void]>;
    registerDefaultCommands(): Promise<void>;
    registerDefaultTypes(): Promise<void>;
    registerDefaultInhibitors(): Promise<void>;
    registerDefaultEvents(): Promise<void>;
    transformMessage(opts: MessageOptions): Promise<any>;
}
