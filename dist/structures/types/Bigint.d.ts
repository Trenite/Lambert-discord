import { ArgumentType } from "../ArgumentType";
import { ParseOptions } from "../ArgumentType";
export declare class BigIntType extends ArgumentType {
    constructor();
    parse({ val, cmd, trigger }: ParseOptions): bigint;
}
