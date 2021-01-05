/// <reference types="node" />
import { LambertDiscordClient } from "./LambertDiscordClient";
import { Argument, ArgumentOptions } from "./Argument";
import { Handler } from "./Handler";
import { LambertMessage } from "./LambertExtended";
import { LambertPermissionResolvable } from "./LambertPermission";
import { ApplicationCommand } from "./ApplicationCommand";
import { CommandTrigger } from "./CommandInteraction";
export declare type ThrottlingOptions = {
    usages: number;
    duration: number;
};
export declare type CommandExecOptions = {
    msg: LambertMessage;
    lang: any;
};
export declare type _Throttle = {
    start: number;
    usages: number;
    timeout?: NodeJS.Timeout;
};
export declare type CommandOptions = {
    id: string;
    handler: Handler<Command>;
    category?: string;
    client?: LambertDiscordClient;
    autoAcknowledge?: boolean;
    aliases?: string[];
    description?: string;
    details?: string;
    guarded?: boolean;
    guildOnly?: boolean;
    hidden?: boolean;
    nsfw?: boolean;
    throttling?: ThrottlingOptions;
    globalThrottling?: ThrottlingOptions;
    clientPermissions?: LambertPermissionResolvable;
    userPermissions?: LambertPermissionResolvable;
    args?: ArgumentOptions[];
};
export declare abstract class Command extends Handler<Command> {
    slashId: string;
    args: Argument[];
    aliases: string[];
    categoryId: string;
    category: Command[];
    autoAcknowledge: boolean;
    client: LambertDiscordClient;
    description: string;
    details: string;
    guarded: boolean;
    guildOnly: boolean;
    hidden: boolean;
    nsfw: boolean;
    throttling: ThrottlingOptions;
    globalThrottling: ThrottlingOptions;
    readonly _throttles: Map<string, _Throttle>;
    _globalThrottle?: _Throttle;
    clientPermissions: LambertPermissionResolvable;
    userPermissions: LambertPermissionResolvable;
    constructor(props: CommandOptions);
    _exec(trigger: CommandTrigger, args: any): Promise<any> | any;
    exec(trigger: CommandTrigger, args: any): Promise<any> | any;
    throttle(userID: string): number;
    getModule(id: string): Command | undefined;
    check(trigger: CommandTrigger): Promise<void>;
    getArgs({ trigger, args }: {
        trigger: CommandTrigger;
        args: Record<string, Argument> | string;
    }): Promise<Record<string, any>>;
    toSlashCommand(): ApplicationCommand;
}
