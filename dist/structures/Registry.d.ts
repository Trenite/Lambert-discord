import { MessageOptions } from "discord.js";
import { Command } from "./Command";
import { Handler } from "./Handler";
import { Inhibitor } from "./Inhibitor";
export declare class Registry {
    commands: Handler<Command>;
    inhibitors: Handler<Inhibitor>;
    events: Handler<Command>;
    types: Handler<Command>;
    messageTransformer: (opts: MessageOptions) => MessageOptions;
    init(): Promise<[void, any, any, any]>;
    registerDefault(): Promise<[void, void, void, void, void]>;
    registerDefaultCommands(): Promise<void>;
    registerDefaultTypes(): Promise<void>;
    registerDefaultInhibitors(): Promise<void>;
    registerDefaultEvents(): Promise<void>;
    registerDefaultMessageTransformers(): Promise<void>;
    destroy(): Promise<[void, void, void, void]>;
}
//# sourceMappingURL=Registry.d.ts.map