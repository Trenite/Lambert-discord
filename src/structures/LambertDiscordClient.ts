require("../structures/LambertExtended");
import Discord, { Client, ClientOptions, PresenceData } from "discord.js";
import { LambertWebSocketOptions } from "./LambertWebSocketManager";
import { Constants } from "./Constants";
import { SyncDatabase } from "./SyncDatabase";
const { Events } = Constants;
import { Database, MongoDatabase } from "lambert-db";
import { LambertServer, LambertServerOptions } from "../api/LambertServer";
import { ClientEventLogger, ClientEventLoggerOptions, WebhookLogger } from "./Logger";
import { Registry, RegistryOptions } from "./Registry";
import { ClientUser } from "discord.js";
import { CommandInteraction, CommandTrigger } from "./CommandInteraction";
import i18next, { i18n } from "i18next";
import { Language } from "./Language";

// @ts-ignore
global.Discord = Discord;

export interface LambertClientOptions extends ClientOptions {
	ws?: LambertWebSocketOptions;
	application_id?: string;
	commandPrefix?: string;
	db?: Database;
	owner_ids?: string[];
	eventLogger?: ClientEventLoggerOptions;
	webhookLogger?: string;
	registry?: RegistryOptions;
	server?: LambertServerOptions;
	token: string;
}

declare module "discord.js" {
	// @ts-ignore
	interface Client {
		api: RouteBuilder;
		options: LambertClientOptions;
		server: LambertServer;
		db: Database;
		dbSync: SyncDatabase;
		eventLogger?: ClientEventLogger;
		webhookLogger?: WebhookLogger;
		registry: Registry;

		on(event: "interactionCreate", listener: (interaction: CommandInteraction) => void): this;
		on(event: "commandTriggered", listener: (trigger: CommandTrigger) => void): this;
	}

	interface BaseClient {
		// @ts-ignore
		api: RouteBuilder;
	}

	interface RouteBuilderMethodOptions {
		query?: any;
		versioned?: boolean;
		auth?: boolean;
		reason?: string;
		headers?: {
			[key: string]: string;
		};
		data?: any;
		files?: any;
	}

	interface RouteBuilderMethods {
		get(opts?: RouteBuilderMethodOptions): Promise<any>;
		post(opts?: RouteBuilderMethodOptions): Promise<any>;
		delete(opts?: RouteBuilderMethodOptions): Promise<any>;
		patch(opts?: RouteBuilderMethodOptions): Promise<any>;
		put(opts?: RouteBuilderMethodOptions): Promise<any>;
	}

	type RouteBuilderReturn = RouteBuilder &
		RouteBuilderMethods & {
			(...args: any[]): RouteBuilderReturn;
		};

	interface RouteBuilder {
		[key: string]: RouteBuilderReturn;
	}
}

export class LambertDiscordClient extends Client {
	public initalized: Promise<any>;
	constructor(options: LambertClientOptions) {
		super(options);
		this.token = options.token;

		this.server = new LambertServer(this, options.server);
		this.eventLogger = new ClientEventLogger(this, options.eventLogger);
		this.webhookLogger = new WebhookLogger(options.webhookLogger);
		this.registry = new Registry({ client: this, ...options.registry });

		if (!this.options.db) this.db = new MongoDatabase();
		else this.db = this.options.db;

		this.dbSync = new SyncDatabase(this);
		// this.lang = i18next.createInstance({});

		process.on("SIGINT", this.shutdown);

		global.client = this;
		this.initalized = this.init();
	}

	public get data() {
		return this.db.data;
	}

	async init() {
		this.emit(Events.DEBUG, "intializing Lambert client");
		this.server.init(); // do not await server intializing, because server is waiting for client to initalize

		this.user = new ClientUser(this, await this.api.users("@me").get());
		if (!this.options.application_id) this.options.application_id = this.user.id;

		await Promise.all([
			this.db.init(),
			this.dbSync.init(),
			this.eventLogger.init(),
			this.webhookLogger.init(),
			this.registry.init(),
		]);

		if (this.options.ws?.autoresume) {
			const shards = (await this.data.shards.get()) || [];
			var sessionIDs: any = {};
			shards.forEach((shard: any) => (sessionIDs[shard.id] = shard.sessionID));

			if (!this.options.ws) this.options.ws = {};
			this.options.ws.sessionIDs = sessionIDs;
		}

		// @ts-ignore
		this.ws.on("INTERACTION_CREATE", async (interaction) => {
			this.emit("interactionCreate", new CommandInteraction(this, interaction));
		});

		this.emit(Events.CLIENT_INIT);
	}

	async login() {
		await this.initalized;
		return super.login();
	}

	shutdown = () => {
		setTimeout(() => {
			process.exit(1);
		}, 1000 * 4);
		this.destroy().finally(() => process.exit());
	};

	async destroy(keepalive: boolean = true, activity?: PresenceData) {
		process.off("SIGINT", this.shutdown);
		if (keepalive) {
			await this.user?.setPresence(activity || { status: "dnd", activity: { name: "stopped" } }).catch(() => {});
		}
		// @ts-ignore
		this.ws.destroy(keepalive);
		super.destroy();

		return Promise.all([
			this.db.destroy(),
			this.dbSync.destroy(),
			this.server.destroy(),
			this.eventLogger.destroy(),
			this.webhookLogger.destroy(),
			this.registry.destroy(),
		]);
	}
}

process.on("uncaughtException", criticalError);
process.on("unhandledRejection", criticalError);

function criticalError(error: Error) {
	let text = `
UNCAUGHT EXCEPTION
There was a critical exception, however Lambert catched it to prevent crashing.
Please catch this error the next time:\n${error && error.stack ? error.stack : error}
`;
	console.error(text);
}

declare global {
	namespace NodeJS {
		interface Global {
			client: LambertDiscordClient | undefined;
		}
	}
}
