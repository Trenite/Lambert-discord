import { ArgumentType } from "../ArgumentType";
import { ParseOptions } from "../ArgumentType";
export declare class UnionType extends ArgumentType {
    constructor();
    parse({ val, cmd, trigger }: ParseOptions): string;
}
