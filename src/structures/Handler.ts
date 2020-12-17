import { Collection } from "discord.js";
import fs from "fs/promises";
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

export class Handler<Holds extends Module> extends Module {
	public readonly modules: Collection<string, Module | Handler<Holds>> = new Collection();

	constructor(id: string) {
		super({ id });
	}

	async init(): Promise<any> {
		return Promise.all(this.modules.map((x) => x.init()));
	}

	async loadAll(dir: string) {
		if (!dir.endsWith("/")) dir += "/";

		let filesDirs = await fs.readdir(dir, { withFileTypes: true });

		await Promise.all(
			filesDirs.map(async (file) => {
				try {
					let path = dir + file.name;
					let stat = await fs.lstat(path);
					if (stat.isDirectory()) {
						// automatically make a category
						let mod = new Handler<Holds>(file.name);
						await mod.loadAll(path);
						return this.register(mod);
					}
					if (!stat.isFile() || !path.endsWith(".js")) return;

					let mod = this.load(path);
					return this.register(mod);
				} catch (error) {}
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

		let mod: Module = new exportedClass();
		mod.filepath = path;

		this.emit(HandlerEvents.LOAD, path);
		return mod;
	}

	async register(mod: Module) {
		if (!mod) throw new Error("Module must not be undefined");
		if (!(mod instanceof Module)) throw new Error("Class must extend Module");
		if (this.modules.get(mod.id)) throw new Error("Module already exists: " + mod.id);
		mod.handler = this;

		await mod.init();
		this.modules.set(mod.id, mod);
		this.emit(HandlerEvents.REGISTER, mod);
	}

	async reload(id: string): Promise<void> {
		const mod = this.modules.get(id);
		if (!mod) throw new Error("Module not found");
		let handler = <Handler<Holds>>mod;
		if (!mod.filepath) {
			if (handler && handler.modules) {
				await Promise.all(handler.modules.map((x) => handler.reload(x.id)));
				return;
			} else throw new Error("Module not reloadable");
		}

		await this.remove(id);
		await this.register(this.load(mod.filepath));
		this.emit(HandlerEvents.RELOAD, id);
	}

	getModule(id: string): Module | undefined {
		return (
			super.getModule(id) ||
			this.modules.find((x) => {
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
		await Promise.all(this.modules.keyArray().map(this.remove));
		this.emit(HandlerEvents.REMOVEALL);
	}

	async destroy() {
		await super.destroy();
		await this.removeAll();
	}
}
