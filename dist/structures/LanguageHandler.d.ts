import { i18n, InitOptions } from "i18next";
import { Handler } from "./Handler";
import { LanguageModule } from "./Language";
export interface LanguageHandlerOptions extends InitOptions {
}
export declare class LanguageHandler extends Handler<LanguageModule> {
    localization: i18n;
    constructor(opts: LanguageHandlerOptions);
    init(): Promise<void>;
}
