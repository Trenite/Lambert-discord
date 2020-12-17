import { EventEmitter } from "events";
import { Handler } from "./Handler";

export class Module extends EventEmitter {
	public handler?: Handler<this>;
	public filepath?: string;
	public id: string;
	protected intialized = false;

	constructor(props: { id: string; filepath?: string }) {
		super();
		this.id = props.id;
		this.filepath = props.filepath;
	}

	async init() {
		this.intialized = true;
	}

	getModule(id: string): Module | undefined {
		if (this.id.toLowerCase() === id.toLowerCase()) return this;
	}

	async destroy() {}

	async reload(id?: string) {
		return this.handler?.reload(this.id);
	}
}
