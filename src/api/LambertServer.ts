import { LambertDiscordClient } from "../structures/LambertDiscordClient";
import express, { Application, NextFunction, Request, Response, Router } from "express";
import { Server } from "http";
import { traverseDirectory } from "../util/traverseDirectory";
import { Constants } from "discord.js";
import { HTTPError } from "./HTTPError";
import bodyParser from "body-parser";
import "express-async-errors";
import { Handler } from "../structures/Handler";
import { Module } from "../structures/Module";

export interface LambertServerOptions {
	port?: number;
	host?: string;
}

export class LambertServer extends Handler<Module> {
	public app: Application;
	public http?: Server;
	public paths: Map<string, Router> = new Map();

	constructor(
		public client: LambertDiscordClient,
		public options: LambertServerOptions = { port: 8080, host: "0.0.0.0" }
	) {
		super({ id: "server" });
		this.app = express();
	}

	async init() {
		this.app.use(bodyParser.json());
		this.app.use((req, res, next) => {
			req.client = this.client;
			next();
		});
		await this.registerRoutes(`${__dirname}/routes/`);
		this.app.use(this.handleError);

		this.client.emit(
			Constants.Events.DEBUG,
			"[Server] waiting for discord client to get ready to prevent weird errors"
		);
		await new Promise((res) => this.client.once("ready", () => res(null)));
		await new Promise((res) => {
			this.app.listen(<number>this.options.port, <string>this.options.host, () => res(null));
		});
		this.client.emit(
			Constants.Events.DEBUG,
			`[Server] ready and listening on ${this.options.host}:${this.options.port}`
		);
	}

	handleError(error: string | Error, req: Request, res: Response, next: NextFunction) {
		if (error instanceof HTTPError) {
			return res.status(error.code).json({ error: error.title });
		} else if (error instanceof ReferenceError || error instanceof SyntaxError || error instanceof TypeError) {
			console.error(error);
			// TODO: display error in dev mode
			return res.status(500).json({ error: "Internal Server Error" });
		}

		return res.status(400).json({ error: error.toString() });
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
			if (router?.default) router = router.default;
			if (router?.prototype?.constructor?.name !== "router") throw `File doesn't export any default router`;
			this.app.use(path, <Router>router);
			this.client.emit(Constants.Events.DEBUG, `[Server] Route ${path} registered`);
		} catch (error) {
			this.client.emit(Constants.Events.ERROR, new Error(`[Server] Failed to register route ${file}: ${error}`));
		}
	}

	async destroy() {
		await new Promise((res) => {
			this.http ? this.http.close(res) : res(null);
		});
	}
}
