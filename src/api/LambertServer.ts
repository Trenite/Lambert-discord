import { LambertDiscordClient } from "../client/LambertDiscordClient";
import express, { Application, Router } from "express";
import { Server } from "http";
import { traverseDirectory } from "../util/traverseDirectory";
import { Constants } from "discord.js";

export interface LambertServerOptions {
	port?: number;
	host?: string;
}

const SlashBackslash = /[\/\\]/g;

export class LambertServer {
	public app: Application;
	public http?: Server;
	public paths: Map<string, Router> = new Map();

	constructor(
		public client: LambertDiscordClient,
		public options: LambertServerOptions = { port: 8080, host: "0.0.0.0" }
	) {
		this.app = express();
	}

	async init() {
		await this.registerRoutes(`${__dirname}/routes/`);
		await new Promise((res) => {
			this.app.listen(<number>this.options.port, <string>this.options.host, res);
		});
		this.client.emit(Constants.Events.DEBUG, `[Server] listening on ${this.options.host}:${this.options.port}`);
	}

	async registerRoutes(root: string) {
		return await traverseDirectory({ dirname: root, recursive: true }, this.registerRoute.bind(this, root));
	}

	/**
	 * @param root - The path from / to the actual routes directory -> Automatically creates a Router based on dir structure
	 * @param file - The complete path to the file
	 */
	registerRoute(root: string, file: string): any {
		if (root.endsWith("/") || root.endsWith("\\")) root = root.slice(0, -1); // removes slash at the end of the root dir
		let path = file.replace(root, ""); // remove root from path and
		path = path.split(".").slice(0, -1).join("."); // trancate .js/.ts file extension of path
		if (path.endsWith("index")) path = path.slice(0, "/index".length * -1); // delete index from path

		try {
			var router = require(file);
			if (router.default) router = router.default;
			if (!router || router.prototype.constructor.name !== "router")
				throw `File doesn't export any default router`;
			this.app.use(path, <Router>router);
			this.client.emit(Constants.Events.DEBUG, `[Server] Route ${path} registered`);
		} catch (error) {
			this.client.emit(Constants.Events.ERROR, new Error(`[Server] Failed to register route ${file}: ${error}`));
		}
	}

	async destroy() {
		await new Promise((res) => {
			this.http ? this.http.close(res) : res();
		});
	}
}
