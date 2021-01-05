import { ERRORS_NAMES } from "./LambertError";
import { Module } from "./Module";
export declare class LanguageModule extends Module {
    constructor();
}
export interface Language {
    id: string;
    codes: string[];
    name: string;
    flag?: string;
    commands?: {
        [category: string]: {
            name: string;
            description?: string;
            details?: string;
            aliases?: string[];
            category?: string;
            args?: {
                id: string;
                description?: string;
                title?: string;
                default?: string;
            }[];
            [extra: string]: any;
        };
    };
    errors?: {
        [key in ERRORS_NAMES]?: string;
    };
}
