import { ArgumentType } from "../ArgumentType";
import { ParseOptions } from "../ArgumentType";
export declare class IntegerType extends ArgumentType {
    constructor();
    parse({ val, cmd, trigger }: ParseOptions): number;
}
