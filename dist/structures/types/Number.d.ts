import { ArgumentType } from "../ArgumentType";
import { ParseOptions } from "../ArgumentType";
export declare class NumberType extends ArgumentType {
    constructor();
    parse({ val, cmd, trigger }: ParseOptions): number;
}
