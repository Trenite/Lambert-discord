import { Guild, Message, User } from "discord.js";
import { Command } from "./Command";
import { LambertDiscordClient } from "./LambertDiscordClient";
import { LambertWebhookClient } from "./LambertWebhook";
import "missing-native-js-functions";
import { performance } from "perf_hooks";

export interface Context {
	cmd?: Command;
	guild?: Guild;
	user?: User;
}

export type LEVELS = "fatal" | "error" | "warn" | "info" | "debug";

const log = console.log;
console.log = function (...args: any[]) {
	const location = new Error().stack.split("\n")[2].slice(4);
	log.call(this, ...args, location);
};

export abstract class Logger {
	static getColor(level: LEVELS) {
		switch (level) {
			case "fatal":
				return 16715520;
			case "error":
				return 16736000;
			case "warn":
				return 16749568;
			case "info":
				return 28629;
			case "debug":
				return 1;
		}
	}

	static getHexColor(level: LEVELS): string {
		// @ts-ignore
		return Logger.getColor(level).toString(16).padStart(6, "0");
	}
}

export function getLoggerLevelsAbove(level: LEVELS) {
	let levels: LEVELS[] = ["debug", "info", "warn", "error", "fatal"];
	return levels.slice(levels.indexOf(level));
}

export type ClientEventLoggerOptions = {
	level: LEVELS;
};

export class ClientEventLogger {
	private start: number;
	constructor(private client: LambertDiscordClient, private options: ClientEventLoggerOptions) {}

	init() {
		if (!this.options) this.options = { level: "info" };
		const levels = getLoggerLevelsAbove(this.options.level);
		if (levels.includes("debug")) this.debug("[Bot] Starting");
		if (levels.includes("debug")) this.client.on("debug", this.debug);
		if (levels.includes("info")) this.client.on("ready", this.ready);
		if (levels.includes("error")) this.client.on("error", this.error);
		if (levels.includes("warn")) this.client.on("warn", this.warn);
		if (levels.includes("fatal")) this.client.on("invalidated", this.invalidated);

		this.start = performance.now();
	}

	debug = (x: string) => {
		console.debug(x);
	};
	error = (x: Error) => {
		console.error(x);
	};
	warn = (x: string) => {
		console.warn(x);
	};
	info = (x: string) => {
		console.info(x);
	};
	invalidated = () => {
		this.error(new Error(`Client Token is invalid`));
	};
	ready = () => {
		let seconds = ((performance.now() - this.start) / 1000).toFixed(2);
		this.info(`[Bot] Ready ${this.client.user?.tag} (${this.client.user?.id}) ✅ in ${seconds} secs`);
	};

	destroy() {
		this.client.off("debug", this.debug);
		this.client.off("error", this.error);
		this.client.off("warn", this.warn);
		this.client.off("ready", this.ready);
		this.client.off("invalidated", this.invalidated);
	}
}

const DiscordFormatCharacters = /[_*`]/g;

export class WebhookLogger {
	private webhook: LambertWebhookClient;
	private lastMessage: Message;

	constructor(webhook: string) {
		if (!webhook) return;
		this.webhook = new LambertWebhookClient(webhook);
	}

	init() {
		if (!this.webhook) return;

		process.stdout.write = this.onLog.bind(this, process.stdout.write);
		process.stderr.write = this.onError.bind(this, process.stderr.write);
	}

	onLog = (old: any, chunk: any): boolean => {
		this.log("info", chunk.toString());
		return old(chunk);
	};

	onError = (old: any, chunk: any): boolean => {
		this.log("error", chunk.toString());
		return old(chunk);
	};

	destroy() {
		process.stdout.off("data", this.onLog);
		process.stderr.off("data", this.onError);

		this.webhook.destroy();
		this.webhook = null;
		this.lastMessage = null;
	}

	protected async log(level: LEVELS, val: string) {
		const color = Logger.getHexColor(level);
		val = val.replace(DiscordFormatCharacters, "\\$&");
		let description = "```\n" + val.slice(0, 2039) + "\n```"; // description limit: 2048

		let options = {
			embeds: [
				{
					description,
					color,
				},
			],
		};

		let promise: Promise<any | undefined>;

		if (
			this.lastMessage &&
			// @ts-ignore
			this.lastMessage.level === level &&
			(this.lastMessage?.embeds.first()?.description + description).length < 2048
		) {
			options.embeds.last().description =
				"```\n" + this.lastMessage?.embeds.first()?.description?.slice(4, -4) + "\n" + val + "\n```";

			promise = this.webhook?.editMessage(this.lastMessage.id, options);
			// @ts-ignore
			this.lastMessage = { ...this.lastMessage, embeds: options.embeds, level };
		} else {
			promise = this.webhook?.send(options).then((e) => {
				// @ts-ignore
				this.lastMessage = { ...e, level };
			});
		}

		await promise?.catch((e) => {
			// CANT LOG -> infinite recursion
			// console.error("there was an error sending logs to the webhook\n", e);
		});
	}
}
