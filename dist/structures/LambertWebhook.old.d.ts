import { Message, StringResolvable, WebhookMessageOptions } from "discord.js";
import { LambertDiscordClient } from "../client/LambertDiscordClient";
declare const RESTManager: any;
export declare class LambertWebhook {
    readonly url: string;
    readonly token: string;
    readonly id: string;
    readonly options: import("discord.js").ClientOptions;
    readonly rest: LambertRESTManager;
    constructor(url: string);
    get api(): any;
    send(content: StringResolvable, options?: WebhookMessageOptions): any;
    setTimeout: typeof setTimeout;
    clearTimeout: typeof clearTimeout;
    setInterval: typeof setInterval;
    clearInterval: typeof clearInterval;
    listenerCount: () => number;
    emit: () => void;
}
export declare class LambertRESTManager extends RESTManager {
    constructor(webhook: LambertWebhook);
    getAuth(): any;
}
export declare class WebhookMessage extends Message {
    webhook: LambertWebhook;
    constructor(webhook: LambertWebhook, data: any, client?: LambertDiscordClient);
    get deletable(): boolean;
    get editable(): boolean;
    edit(content: StringResolvable, options?: WebhookMessageOptions): any;
    delete(options?: {
        timeout?: number;
        reason?: string;
    }): any;
}
export declare class WebhookChannel {
}
export {};
//# sourceMappingURL=LambertWebhook.old.d.ts.map