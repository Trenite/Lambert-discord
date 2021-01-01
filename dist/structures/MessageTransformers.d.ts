import { MessageOptions } from "discord.js";
export declare const imageFormats: string[];
export declare const authors: {
    error: {
        iconURL: string;
        name: string;
    };
    success: {
        iconURL: string;
        name: string;
    };
    wait: {
        iconURL: string;
    };
    warn: {
        iconURL: string;
        name: string;
    };
};
export declare function embedMessageTransformer(opts: MessageOptions): Promise<MessageOptions>;
export declare function enforceLimits(opts: MessageOptions): any;
export declare function removeNull(obj: any): any;
export declare type MessageTransformer = (opts: MessageOptions) => Promise<MessageOptions>;
