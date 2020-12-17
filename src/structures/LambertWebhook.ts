import { WebhookClient, StringResolvable, WebhookMessageOptions, APIMessage } from "discord.js";
import { getWebhookAuth } from "../util/discord";

export class LambertWebhookClient extends WebhookClient {
	constructor(url: string) {
		const { token, id } = getWebhookAuth(url);
		super(id, token);
	}

	async editMessage(
		id: string,
		content: StringResolvable | APIMessage | WebhookMessageOptions,
		options?: WebhookMessageOptions
	) {
		if (!id) throw new Error("please specify a message id");
		let apiMessage;

		if (content instanceof APIMessage) {
			apiMessage = content.resolveData();
		} else {
			apiMessage = APIMessage.create(this, content, <WebhookMessageOptions>options).resolveData();
			// @ts-ignore
			if (Array.isArray(apiMessage.data.content)) {
				return Promise.all(apiMessage.split().map(this.send.bind(this)));
			}
		}

		const { data, files } = await apiMessage.resolveFiles();
		return (
			this.client.api
				// @ts-ignore
				.webhooks(this.id, this.token)
				.messages(id)
				.patch({
					data,
					files,
					auth: false,
				})
				.then((d: any) => {
					// @ts-ignore
					const channel = this.client.channels ? this.client.channels.cache.get(d.channel_id) : undefined;
					if (!channel) return d;
					return channel.messages.add(d, false);
				})
		);
	}
}
