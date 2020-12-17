/// <reference types="node" />
import { LambertDiscordClient } from "../client/LambertDiscordClient";
import { Argument, ArgumentOptions } from "./Argument";
import { Handler } from "./Handler";
import { LambertMessage } from "./LambertExtended";
import { LambertPermissionResolvable } from "./LambertPermission";
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
    aliases: string[];
    description: string;
    details: string;
    guarded: boolean;
    guildOnly: boolean;
    hidden: boolean;
    nsfw: boolean;
    throttling: ThrottlingOptions;
    globalThrottling: ThrottlingOptions;
    clientPermissions: LambertPermissionResolvable;
    userPermissions: LambertPermissionResolvable;
    args: ArgumentOptions[];
};
export declare abstract class Command extends Handler<Command> {
    client: LambertDiscordClient;
    aliases: string[];
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
    args: Argument[];
    constructor(props: CommandOptions);
    exec(): Promise<any> | any;
    throttle(userID: string): number;
    getModule(id: string): Command | undefined;
}
//# sourceMappingURL=Command.d.ts.map