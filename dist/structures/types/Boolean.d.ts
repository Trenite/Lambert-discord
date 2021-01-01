import { ArgumentType } from "../ArgumentType";
import { ParseOptions } from "../ArgumentType";
export declare class BooleanType extends ArgumentType {
    constructor();
    parse({ val, cmd, trigger }: ParseOptions): boolean;
}
