import { ArgumentType } from "../ArgumentType";
import { ParseOptions } from "../ArgumentType";
export declare class SubCommandType extends ArgumentType {
    constructor();
    parse({ val, cmd, trigger }: ParseOptions): import("../Command").Command;
}
