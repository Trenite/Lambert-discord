import { Command } from "../Command";
import { Handler } from "../Handler";
import { CommandTrigger } from "../CommandInteraction";
export declare class test extends Command {
    constructor(handler: Handler<Command>);
    exec(trigger: CommandTrigger, args: any): Promise<void>;
}
