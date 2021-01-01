import { Collection } from "discord.js";
import { EventEmitter } from "events";
import { Handler } from "./Handler";
import { Module } from "./Module";
import "missing-native-js-functions";

export class InhibitorHandler extends Handler<Inhibitor> {
	public readonly modules: Collection<string, Inhibitor | InhibitorHandler> = new Collection();
	private readonly passthrough: Function;

	constructor(public readonly emitter: EventEmitter) {
		super({ id: emitter.constructor.name });

		this.passthrough = emitter.emit;
		this.onEmit = this.onEmit.bind(this);
		// @ts-ignore
		emitter.emit = this.onEmit;
	}

	async onEmit(event: string, ...args: any[]): Promise<boolean> {
		let result: boolean;

		try {
			result = await this.test(event, ...args);
		} catch (error) {
			result = false;
		}

		if (result) return this.passthrough.call(this.emitter, event, ...args);
		return false;
	}

	async test(event: string, ...args: any[]): Promise<boolean> {
		let promises = await Promise.all(this.modules.map((inhibitor) => inhibitor.test(event, ...args)));
		return promises.every((x) => !!x);
	}
}

export interface Inhibitor extends Module {
	test(event: string, ...args: any[]): Promise<boolean> | boolean;
}
