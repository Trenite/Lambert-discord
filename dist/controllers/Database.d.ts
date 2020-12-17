import { Provider } from "../structures/Provider";
export declare type Constructable<T> = new (...args: any[]) => T;
export interface Database<P extends Provider> {
    provider: Constructable<P>;
    init(): Promise<any>;
    destroy(): Promise<any>;
}
//# sourceMappingURL=Database.d.ts.map