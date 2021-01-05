import { Collection } from "discord.js";
import fs from "fs/promises";
import { LambertDiscordClient } from "..";
import { Module } from "./Module";

export const HandlerEvents = {
	LOAD: "load",
	LOADALL: "loadAll",
	REGISTER: "register",
	RELOAD: "reload",
	RELOADALL: "reloadAll",
	REMOVE: "remove",
	REMOVEALL: "removeAll",
	ERROR: "error",
};

export type HandlerOptions = { id: string; json?: boolean };

export class Handler<Holds extends Module> extends Module {
	public readonly client?: LambertDiscordClient;
	public readonly modules: Collection<string, Holds> = new Collection();
	private loadJson: boolean;

	constructor({ id, json }: HandlerOptions) {
		super({ id });
		this.loadJson = json;
	}

	async loadAll(dir: string) {
		if (!dir.endsWith("/")) dir += "/";

		let filesDirs = await fs.readdir(dir, { withFileTypes: true });

		await Promise.all(
			filesDirs.map(async (file) => {
				let path = dir + file.name;
				try {
					let stat = await fs.lstat(path);
					if (stat.isDirectory()) {
						return await this.loadAll(path);
					}
					const fileTypes = ["js"];
					const extension = path.split(".").last();

					if (this.loadJson) fileTypes.push("json");
					if (!stat.isFile() || !fileTypes.includes(extension)) return;

					let mod = this.load(path);
					return this.register(mod);
				} catch (error) {
					console.error("error loading file: " + path, error);
				}
			})
		);
	}

	load(path: string) {
		let file = require(path);
		if (file.default) file = file.default;
		else {
			let k = Object.keys(file);
			if (k.length) file = file[k.first()];
		}
		let exportedClass = file;
		var mod: Holds;

		if (isClass(exportedClass)) mod = new exportedClass(this);
		else mod = exportedClass;

		if (!mod.id) mod.id = path;
		mod.filepath = path;

		this.emit(HandlerEvents.LOAD, path);
		return mod;
	}

	async register(mod: Holds) {
		if (!mod) throw new Error("Module must not be undefined");
		if (!(mod instanceof Module)) throw new Error("Class must extend Module");
		if (this.modules.get(mod.id)) throw new Error("Module already exists: " + mod.id);
		mod.handler = this;

		await mod.init();
		this.modules.set(mod.id, mod);
		this.emit(HandlerEvents.REGISTER, mod);
		return mod;
	}

	async reload(id: string): Promise<void> {
		const mod: Holds = this.modules.get(id);
		if (!mod) throw new Error("Module not found");

		await this.remove(id);
		await this.register(this.load(mod.filepath));
		this.emit(HandlerEvents.RELOAD, id);
	}

	getModule(id: string): Holds | undefined {
		return (
			<Holds>super.getModule(id) ||
			this.modules.find((x) => {
				if (!x || !x.getModule) return;
				return <boolean>(<unknown>x.getModule(id));
			})
		);
	}

	async reloadAll() {
		await Promise.all(this.modules.keyArray().map(this.reload));
		this.emit(HandlerEvents.RELOADALL);
	}

	async remove(id: string) {
		const mod = this.modules.get(id);
		if (!mod) throw new Error("Module not found");

		if (mod.filepath) {
			const filepath = require.resolve(mod.filepath);
			if (filepath) delete require.cache[filepath];
		}

		await mod.destroy();
		this.modules.delete(id);
		this.emit(HandlerEvents.REMOVE, id);
	}

	async removeAll() {
		await Promise.all(this.modules.keyArray().map((x) => this.remove(x)));
		this.emit(HandlerEvents.REMOVEALL);
	}

	async destroy() {
		await super.destroy();
		await this.removeAll();
	}
}

function isClass(obj: any) {
	const isCtorClass = obj.constructor && obj.constructor.toString().substring(0, 5) === "class";
	if (obj.prototype === undefined) {
		return isCtorClass;
	}
	const isPrototypeCtorClass =
		obj.prototype.constructor &&
		obj.prototype.constructor.toString &&
		obj.prototype.constructor.toString().substring(0, 5) === "class";
	return isCtorClass || isPrototypeCtorClass;
}
