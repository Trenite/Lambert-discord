"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookChannel = exports.WebhookMessage = exports.LambertRESTManager = exports.LambertWebhook = void 0;
const discord_js_1 = require("discord.js");
const discord_1 = require("../util/discord");
const RESTManager = require("../../node_modules/discord.js/src/rest/RESTManager");
const OPTIONS = discord_js_1.Constants.DefaultOptions;
class LambertWebhook {
    constructor(url) {
        this.url = url;
        this.options = OPTIONS;
        this.setTimeout = setTimeout;
        this.clearTimeout = clearTimeout;
        this.setInterval = setInterval;
        this.clearInterval = clearInterval;
        this.listenerCount = () => 0;
        this.emit = () => { };
        const { token, id } = discord_1.getWebhookAuth(url);
        this.token = token;
        this.id = id;
        this.rest = new LambertRESTManager(this);
    }
    get api() {
        return this.rest.api;
    }
    send(content, options = {}) {
        const { data } = content instanceof discord_js_1.APIMessage
            ? content.resolveData()
            : new discord_js_1.APIMessage(
            // @ts-ignore
            { client: this }, discord_js_1.APIMessage.transformOptions(content, options, {}, true)).resolveData();
        return this.api
            .webhooks(this.id)(this.token)
            .messages(this.id)
            .patch({ data })
            .then((d) => {
            // @ts-ignore
            const clone = this._clone();
            clone._patch(d);
            return clone;
        });
    }
}
exports.LambertWebhook = LambertWebhook;
class LambertRESTManager extends RESTManager {
    constructor(webhook) {
        super(webhook, "");
    }
    getAuth() {
        return this.client.token;
    }
}
exports.LambertRESTManager = LambertRESTManager;
class WebhookMessage extends discord_js_1.Message {
    constructor(webhook, data, client) {
        // @ts-ignore
        super(webhook, data, channel);
        delete data.author;
        this.webhook = webhook;
        let channel = client ? client.channels.resolve(data.id) : new WebhookChannel();
    }
    // @ts-ignore
    get deletable() {
        return !this.deleted;
    }
    // @ts-ignore
    get editable() {
        return this.deletable;
    }
    // @ts-ignore
    edit(content, options = {}) {
        const { data } = content instanceof discord_js_1.APIMessage
            ? content.resolveData()
            : new discord_js_1.APIMessage(
            // @ts-ignore
            { client: this.webhook }, discord_js_1.APIMessage.transformOptions(content, options, {}, true)).resolveData();
        return this.webhook.api
            .webhooks(this.webhook.id)(this.webhook.token)
            .messages(this.id)
            .patch({ data })
            .then((d) => {
            // @ts-ignore
            const clone = this._clone();
            clone._patch(d);
            return clone;
        });
    }
    delete(options = {}) {
        if (typeof options !== "object") {
            // @ts-ignore
            return Promise.reject(new TypeError("INVALID_TYPE", "options", "object", true));
        }
        const { timeout = 0, reason } = options;
        if (timeout <= 0) {
            return this.webhook.api.webhooks(this.webhook.id)(this.webhook.token).messages(this.id).delete({ reason });
        }
        else {
            return new Promise((resolve) => {
                this.client.setTimeout(() => {
                    resolve(this.delete({ reason }));
                }, timeout);
            });
        }
    }
}
exports.WebhookMessage = WebhookMessage;
class WebhookChannel {
}
exports.WebhookChannel = WebhookChannel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGFtYmVydFdlYmhvb2sub2xkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3N0cnVjdHVyZXMvTGFtYmVydFdlYmhvb2sub2xkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDJDQVFvQjtBQUVwQiw2Q0FBaUQ7QUFDakQsTUFBTSxXQUFXLEdBQVEsT0FBTyxDQUFDLG9EQUFvRCxDQUFDLENBQUM7QUFFdkYsTUFBTSxPQUFPLEdBQUcsc0JBQVMsQ0FBQyxjQUFjLENBQUM7QUFFekMsTUFBYSxjQUFjO0lBTTFCLFlBQTRCLEdBQVc7UUFBWCxRQUFHLEdBQUgsR0FBRyxDQUFRO1FBSHZCLFlBQU8sR0FBRyxPQUFPLENBQUM7UUFvQ2xDLGVBQVUsR0FBRyxVQUFVLENBQUM7UUFDeEIsaUJBQVksR0FBRyxZQUFZLENBQUM7UUFFNUIsZ0JBQVcsR0FBRyxXQUFXLENBQUM7UUFDMUIsa0JBQWEsR0FBRyxhQUFhLENBQUM7UUFFOUIsa0JBQWEsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDeEIsU0FBSSxHQUFHLEdBQUcsRUFBRSxHQUFFLENBQUMsQ0FBQztRQXZDZixNQUFNLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxHQUFHLHdCQUFjLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDMUMsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7UUFDYixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUVELElBQUksR0FBRztRQUNOLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7SUFDdEIsQ0FBQztJQUVELElBQUksQ0FBQyxPQUF5QixFQUFFLFVBQWlDLEVBQUU7UUFDbEUsTUFBTSxFQUFFLElBQUksRUFBRSxHQUNiLE9BQU8sWUFBWSx1QkFBVTtZQUM1QixDQUFD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