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
        static equals(x: any, y: any): boolean;
        equals(other: any): boolean;
    }
    interface String {
        capitalize(): String;
    }
}
export declare function init(): void;
//# sourceMappingURL=JavaScript.d.ts.map