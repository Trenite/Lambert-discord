import { ArgumentType } from "../ArgumentType";
import { ParseOptions } from "../ArgumentType";
export declare class StringType extends ArgumentType {
    constructor();
    parse({ val, cmd, trigger }: ParseOptions): string;
}
