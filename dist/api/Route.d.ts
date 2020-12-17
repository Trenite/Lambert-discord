import { Request, Response } from "express";
import { LambertDiscordClient } from "..";
import { LambertPermissionResolvable } from "../structures/LambertPermission";
import { LambertRequestParamaters } from "./LambertRequest";
/**
 *
 * mgmt reverse proxy -> redirect request to shard:
 * General check:
 * - permission
 * - auth of reverse proxy
 * - require specific params with type:
 *
 * Command Check:
 * - command can check it self with function
 *
 * Request:
 * - mgmt (proxy)
 * 	optional:
 * - user
 * - guild
 * 	- role
 *  - emoji
 *  -
 * - member
 * - channel
 *	- message
 *
 */
export declare type RouteOptions = {
    client: LambertDiscordClient;
    permissions?: LambertPermissionResolvable;
    parameter?: Omit<LambertRequestParamaters, "client">;
};
export declare function check(options: RouteOptions): Promise<(req: Request, res: Response, next: Function) => Promise<void>>;
//# sourceMappingURL=Route.d.ts.map