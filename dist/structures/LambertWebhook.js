"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LambertWebhookClient = void 0;
const discord_js_1 = require("discord.js");
const discord_1 = require("../util/discord");
class LambertWebhookClient extends discord_js_1.WebhookClient {
    constructor(url) {
        const { token, id } = discord_1.getWebhookAuth(url);
        super(id, token);
    }
    editMessage(id, content, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id)
                throw new Error("please specify a message id");
            let apiMessage;
            if (content instanceof discord_js_1.APIMessage) {
                apiMessage = content.resolveData();
            }
            else {
                apiMessage = discord_js_1.APIMessage.create(this, content, options).resolveData();
                // @ts-ignore
                if (Array.isArray(apiMessage.data.content)) {
                    return Promise.all(apiMessage.split().map(this.send.bind(this)));
                }
            }
            const { data, files } = yield apiMessage.resolveFiles();
            return (this.client.api
                // @ts-ignore
                .webhooks(this.id, this.token)
                .messages(id)
                .patch({
                data,
                files,
                auth: false,
            })
                .then((d) => {
                // @ts-ignore
                const channel = this.client.channels ? this.client.channels.cache.get(d.channel_id) : undefined;
                if (!channel)
                    return d;
                return channel.messages.add(d, false);
            }));
        });
    }
}
exports.LambertWebhookClient = LambertWebhookClient;
//# sourceMappingURL=LambertWebhook.js.map