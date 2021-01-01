import {
	Message,
	Constants,
	StringResolvable,
	APIMessage,
	MessageEditOptions,
	MessageEmbed,
	WebhookMessageOptions,
} from "discord.js";
import { LambertDiscordClient } from "./LambertDiscordClient";
import { getWebhookAuth } from "../util/discord";
const RESTManager: any = require("../../node_modules/discord.js/src/rest/RESTManager");

const OPTIONS = Constants.DefaultOptions;

export class LambertWebhook {
	public readonly token: string;
	public readonly id: string;
	public readonly options = OPTIONS;
	public readonly rest: LambertRESTManager;

	constructor(public readonly url: string) {
		const { token, id } = getWebhookAuth(url);
		this.token = token;
		this.id = id;
		this.rest = new LambertRESTManager(this);
	}

	get api() {
		return this.rest.api;
	}

	send(content: StringResolvable, options: WebhookMessageOptions = {}) {
		const { data } =
			content instanceof APIMessage
				? content.resolveData()
				: new APIMessage(
						// @ts-ignore
						{ client: this },
						APIMessage.transformOptions(content, options, {}, true)
				  ).resolveData();

		return this.api
			.webhooks(this.id)(this.token)
			.messages(this.id)
			.patch({ data })
			.then((d: any) => {
				// @ts-ignore
				const clone = this._clone();
				clone._patch(d);
				return clone;
			});
	}

	setTimeout = setTimeout;
	clearTimeout = clearTimeout;

	setInterval = setInterval;
	clearInterval = clearInterval;

	listenerCount = () => 0;
	emit = () => {};
}

export class LambertRESTManager extends RESTManager {
	constructor(webhook: LambertWebhook) {
		super(webhook, "");
	}

	getAuth() {
		return this.client.token;
	}
}

export class WebhookMessage extends Message {
	public webhook: LambertWebhook;

	constructor(webhook: LambertWebhook, data: any, client?: LambertDiscordClient) {
		// @ts-ignore
		super(webhook, data, channel);
		delete data.author;

		this.webhook = webhook;
		let channel = client ? client.channels.resolve(data.id) : new WebhookChannel();
	}

	// @ts-ignore
	get deletable(): boolean {
		return !this.deleted;
	}

	// @ts-ignore
	get editable() {
		return this.deletable;
	}

	// @ts-ignore
	edit(content: StringResolvable, options: WebhookMessageOptions = {}) {
		const { data } =
			content instanceof APIMessage
				? content.resolveData()
				: new APIMessage(
						// @ts-ignore
						{ client: this.webhook },
						APIMessage.transformOptions(content, options, {}, true)
				  ).resolveData();

		return this.webhook.api
			.webhooks(this.webhook.id)(this.webhook.token)
			.messages(this.id)
			.patch({ data })
			.then((d: any) => {
				// @ts-ignore
				const clone = this._clone();
				clone._patch(d);
				return clone;
			});
	}

	delete(options: { timeout?: number; reason?: string } = {}) {
		if (typeof options !== "object") {
			// @ts-ignore
			return Promise.reject(new TypeError("INVALID_TYPE", "options", "object", true));
		}
		const { timeout = 0, reason } = options;
		if (timeout <= 0) {
			return this.webhook.api.webhooks(this.webhook.id)(this.webhook.token).messages(this.id).delete({ reason });
		} else {
			return new Promise((resolve) => {
				this.client.setTimeout(() => {
					resolve(this.delete({ reason }));
				}, timeout);
			});
		}
	}
}

export class WebhookChannel {}
