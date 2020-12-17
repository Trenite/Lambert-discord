Array.prototype.remove = function <T>(this: T[], elem: T): T[] {
	// do not use filter to modify current array
	const index = this.indexOf(elem);
	if (index === -1) return this;

	this.splice(index, 1);
	return this; //.filter((e) => e !== elem);
};

Array.prototype.insert = function <T>(i: number, elem: T) {
	return this.splice(i, 0, elem);
};

Array.prototype.flat = function () {
	return this.reduce((acc, val) => (Array.isArray(val) ? acc.concat(val.flat()) : acc.concat(val)), []);
};

Array.prototype.last = function () {
	return this[this.length - 1];
};

Array.prototype.first = function () {
	return this[0];
};

Array.prototype.unique = function () {
	return [...new Set(this)];
};

Array.prototype.random = function () {
	return this[Math.floor(Math.random() * this.length)];
};

Array.prototype.shuffle = function () {
	for (let i = this.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[this[i], this[j]] = [this[j], this[i]];
	}
	return this;
};

Array.prototype.findMap = function <T>(
	predicate: (value: T, index: number, obj: T[]) => unknown,
	map: (value: T) => any
): any | undefined {
	let found = this.find(predicate);
	return found !== undefined ? map(found) : found;
};

Object.prototype.forEach = function (callback) {
	// @ts-ignore
	return Object.keys(this).forEach((key) => callback(this[key], key));
};

Object.prototype.map = function (callback) {
	let obj = {};

	Object.keys(this).forEach((key) => {
		// @ts-ignore
		obj[key] = callback(this[key], key);
	});
	return obj;
};

Object.prototype.equals = function (other: any): boolean {
	return JSON.stringify(this) === JSON.stringify(other);
};

// @ts-ignore
Object.equals = (x: any, y: any): boolean => x.equals(y);

String.prototype.capitalize = function () {
	return this.slice(0, 1).toUpperCase() + this.slice(1);
};

declare global {
	interface Array<T> {
		remove(o: T): Array<T>;
		flat(): T;
		first(): T;
		last(): T;
		findMap<T>(predicate: (value: T, index: number, obj: T[]) => unknown, map: (value: T) => any): any | undefined;
		random(): T;
		unique(): T[];
		shuffle(): T[];
		insert(i: number, elem: T): T[];
	}

	interface Object {
		forEach(callback: (element: any, index?: string) => any): void;
		map(callback: (element: any, index?: string) => any): this;
		// @ts-ignore
		static equals(x: any, y: any): boolean;
		equals(other: any): boolean;
	}

	interface String {
		capitalize(): String;
	}
}

export function init() {} // needed to actually import the file to circumenvent typescript optimizations
