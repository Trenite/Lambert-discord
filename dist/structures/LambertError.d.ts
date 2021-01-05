export declare class LambertError extends Error {
    code: ERRORS;
    data: any;
    constructor(code: ERRORS, data: any);
    getMessage(language: any): void;
}
export declare enum ERRORS {
    THROTTLED = 0,
    GUILD_ONLY = 1,
    DIFFERENT_GUILD = 2,
    MISSING_PERMISSION = 3,
    MISSING_PERMISSIONS = 4,
    ARGUMENT_REQUIRED = 5,
    ARGUMENT_TOO_BIG = 6,
    ARGUMENT_TOO_SMALL = 7,
    NOT_A_TYPE = 8,
    NOT_A_NUMBER = 9,
    NOT_A_STRING = 10,
    NOT_A_BIGINT = 11,
    NOT_A_BOOLEAN = 12,
    NOT_A_CHANNEL = 13,
    NOT_A_TEXTCHANNEL = 14,
    NOT_A_CATEGORYCHANNEL = 15,
    NOT_A_VOICECHANNEL = 16,
    NOT_A_NSFW_CHANNEL = 17,
    NOT_A_COMMAND = 18,
    NOT_A_GUILD_MEMBER = 19,
    NOT_A_USER = 20,
    NOT_A_MESSAGE = 21,
    NOT_A_ROLE = 22
}
export declare type ERRORS_NAMES = keyof typeof ERRORS;
