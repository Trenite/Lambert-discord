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
//# sourceMappingURL=LambertWebhook.old.js.map