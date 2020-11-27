import { Property } from "../structures/Datastore";

export type Constructable<T> = new (...args: any[]) => T;

export interface Database<P extends Property> {
	provider: Constructable<P>;

	init(): Promise<any>;
	destroy(): Promise<any>;
}
