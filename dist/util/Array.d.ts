declare global {
    interface Array<T> {
        remove(o: T): Array<T>;
        flat(): T;
        first(): T;
        last(): T;
        random(): T;
        unique(): T[];
        shuffle(): T[];
        insert(i: number, elem: T): T[];
    }
    interface Object {
        forEach(callback: (element: any, index?: string) => any): void;
        map(callback: (element: any, index?: string) => any): this;
    }
}
export declare function init(): void;
//# sourceMappingURL=Array.d.ts.map