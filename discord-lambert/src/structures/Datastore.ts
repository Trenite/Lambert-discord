// @ts-nocheck

import { LambertDiscordClient } from "../client/LambertDiscordClient";

// PATH:
// users
// users-311129357362135041)
// guilds
// guilds-769302137364283432)
// guilds-769302137364283432).members-311129357362135041)

export default class Datastore {
	constructor(public client: LambertDiscordClient, public path: string) {
		const parts = path.split(".").map((x) => x.split("-"));
		const table = parts[0][0];
	}
}

class Property {
	constructor();

	async delete() {}
}

const noop = () => {}; // eslint-disable-line no-empty-function
const methods = ["get", "post", "delete", "patch", "put"];
const reflectors = [
	"toString",
	"valueOf",
	"inspect",
	"constructor",
	Symbol.toPrimitive,
	Symbol.for("nodejs.util.inspect.custom"),
];

function buildRoute(manager) {
	const route = [""];
	const handler = {
		get(target, name) {
			if (reflectors.includes(name)) return () => route.join("/");
			if (methods.includes(name)) {
				// finish -> make request
			}
			route.push(name);
			return new Proxy(noop, handler);
		},
		apply(target, _, args) {
			route.push(...args.filter((x) => x != null));
			return new Proxy(noop, handler);
		},
	};
	return new Proxy(noop, handler);
}
