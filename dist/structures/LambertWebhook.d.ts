import { WebhookClient, StringResolvable, WebhookMessageOptions, APIMessage } from "discord.js";
export declare class LambertWebhookClient extends WebhookClient {
    constructor(url: string);
    editMessage(id: string, content: StringResolvable | APIMessage | WebhookMessageOptions, options?: WebhookMessageOptions): Promise<any>;
}
