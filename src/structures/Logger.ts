import { Guild, Message, User } from "discord.js";
import { Command } from "./Command";
import { Signale } from "signale";
import { LambertDiscordClient } from "../client/LambertDiscordClient";
import { init } from "../util/JavaScript";
import { LambertWebhookClient } from "./LambertWebhook";
init();
import inspector from "inspector";
import { performance } from "perf_hooks";

export interface Context {
	cmd?: Command;
	guild?: Guild;
	user?: User;
}

export type LEVELS = "fatal" | "error" | "warn" | "info" | "debug";

export abstract class Logger {
	public fatal(val: string, ctx?: Context): string {
		return this.log("fatal", val, ctx);
	}
	public error(val: string, ctx?: Context): string {
		return this.log("error", val, ctx);
	}
	public warn(val: string, ctx?: Context): string {
		return this.log("warn", val, ctx);
	}
	public info(val: string, ctx?: Context): string {
		return this.log("info", val, ctx);
	}

	public debug(val: string, ctx?: Context): string {
		return this.log("debug", val, ctx);
	}

	protected log(level: string, val: string, ctx?: Context): string {
		let str = "";
		if (ctx) {
			if (ctx.cmd) str += `[CMD]: ${ctx.cmd.id} `;
			if (ctx.cmd) str += `[USER]: ${ctx.user?.tag} `;
			if (ctx.cmd) str += `[GUILD]: ${ctx.guild?.name}(${ctx.guild?.id}) `;
		}
		return str + val;
	}

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

export type LoggerOptions = {
	loggers?: Logger[];
	level?: LEVELS;
};

export class LoggerCollection extends Logger {
	public loggers: Logger[];

	constructor(private opts: LoggerOptions = {}) {
		super();
		if (!opts.loggers) opts.loggers = [];
		this.loggers = opts.loggers;
		opts.loggers.push(new ChalkLogger(opts.level));
	}

	protected log(level: LEVELS, val: string, ctx?: Context): string {
		this.loggers.map((logger) => logger[level](val, ctx));
		return val;
	}

	public add(logger: Logger) {
		this.loggers.push(logger);
	}

	public remove(logger: Logger) {
		this.loggers.remove(logger);
	}
}

export class LambertDiscordClientEventLogger {
	private start: number;
	constructor(private client: LambertDiscordClient) {}

	init() {
		this.client.on("debug", this.debug);
		this.client.on("error", this.error);
		this.client.on("warn", this.warn);
		this.client.on("ready", this.ready);
		this.client.on("invalidated", this.invalidated);
		this.info("[Bot] Starting");
		this.start = performance.now();
	}

	debug = (x: string) => {
		this.client.logger.debug(x);
	};
	error = (x: Error) => {
		this.client.logger.error(x.toString());
	};
	warn = (x: string) => {
		this.client.logger.warn(x);
	};
	info = (x: string) => {
		this.client.logger.info(x);
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

export type WebhookLoggerOptions = {
	loggers: {
		fatal?: string;
		error?: string;
		warn?: string;
		debug?: string;
		info?: string;
	};
	level: LEVELS;
};

export function getLoggerLevelsAbove(level: LEVELS) {
	let levels: LEVELS[] = ["debug", "info", "warn", "error", "fatal"];
	return levels.slice(levels.indexOf(level));
}

const DiscordFormatCharacters = /[_*`]/g;

export class WebhookLogger extends Logger {
	private webhooks: {
		fatal?: LambertWebhookClient;
		error?: LambertWebhookClient;
		warn?: LambertWebhookClient;
		debug?: LambertWebhookClient;
		info?: LambertWebhookClient;
	} = {};
	private lastMessage: Message;
	private level: LEVELS;

	constructor(opts: WebhookLoggerOptions) {
		super();
		this.level = opts.level;
		Object.keys(opts.loggers).forEach((key) => {
			// @ts-ignore
			this.webhooks[key] = new LambertWebhookClient(opts.loggers[key]);
		});
	}

	protected log(level: LEVELS, val: string, ctx: Context = {}): string {
		const above = getLoggerLevelsAbove(this.level);
		if (!above.includes(level)) return val;

		const aboveLevel = getLoggerLevelsAbove(level);
		const fallback = aboveLevel
			// @ts-ignore
			.filter((x) => !!this.webhooks[x])
			.first();

		level = this.webhooks[level] ? level : fallback;
		const levelWebhook = this.webhooks[level];
		if (!levelWebhook) return val;

		const color = Logger.getHexColor(level);
		if (ctx.cmd?.id) val += `[${ctx.cmd.id}] `;
		val = val.replace(DiscordFormatCharacters, "\\$&");
		let description = "```\n" + val.slice(0, 2039) + "\n```";

		let options = {
			embeds: [
				{
					description,
					color,
					author: {
						name: ctx.guild ? `${ctx.guild.name} (${ctx.guild.id})` : undefined,
						iconURL: ctx.guild?.iconURL({ dynamic: true, format: "jpg", size: 256 }) || undefined,
					},
					footer: {
						text: ctx.user ? `${ctx.user.username} (${ctx.user.id})` : "",
						iconURL: ctx.user?.displayAvatarURL({ dynamic: true, format: "jpg", size: 256 }),
					},
				},
			],
		};

		let promise: Promise<any | undefined>;

		if (
			this.lastMessage &&
			// @ts-ignore
			this.lastMessage.level === level &&
			// @ts-ignore
			this.lastMessage.ctx.equals(ctx) &&
			(this.lastMessage?.embeds.first()?.description + description).length < 2048
		) {
			options.embeds.last().description =
				"```\n" + this.lastMessage?.embeds.first()?.description?.slice(4, -4) + "\n" + val + "\n```";

			// @ts-ignore
			promise = levelWebhook.editMessage(this.lastMessage.id, options);
			// @ts-ignore
			this.lastMessage = { ...this.lastMessage, embeds: options.embeds, level, ctx };
		} else {
			promise = levelWebhook.send(options).then((e) => {
				// @ts-ignore
				this.lastMessage = { ...e, level, ctx };
			});
		}

		promise.catch((e) => {
			console.error("there was an error sending logs to the webhook\n", e);
		});

		return val;
	}
}

export class ChalkLogger extends Logger {
	private signale: Signale;
	constructor(private level: LEVELS = "info") {
		super();
		this.signale = new Signale({ logLevel: "info", stream: process.stdout });
	}

	log(level: LEVELS, val: string, ctx?: Context): string {
		if (!getLoggerLevelsAbove(this.level).includes(level)) return val;
		val = super.log(level, val, ctx);
		// @ts-ignore
		var debug = typeof v8debug === "object" || inspector.url();
		if (debug) console.log(val);
		else this.signale[level](val);
		return val;
	}
}
