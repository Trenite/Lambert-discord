export class Argument {}

export type valueOrFunction<B, T> = (any: B) => T | T;

export type ArgumentOptions = {
	id: string;
	title?: string;
	type: [];
	max?: number;
	min?: number;
	default?: any;
	wait?: number;
};
