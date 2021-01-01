export declare class LambertError extends Error {
    code: ERRORS;
    data: any;
    constructor(code: ERRORS, data: any);
    getMessage(language: any): void;
}
export declare enum ERRORS {
    NOT_NSFW_CHANNEL = 0,
    THROTTLED = 1,
    GUILD_ONLY = 2,
    DIFFERENT_GUILD = 3,
    MISSING_PERMISSION = 4,
    MISSING_PERMISSIONS = 5,
    NOT_A_TYPE = 6,
    NOT_A_NUMBER = 7,
    NOT_A_STRING = 8,
    NOT_A_BIGINT = 9,
    NOT_A_BOOLEAN = 10,
    NOT_A_CHANNEL = 11,
    NOT_A_TEXTCHANNEL = 12,
    NOT_A_CATEGORYCHANNEL = 13,
    NOT_A_VOICECHANNEL = 14,
    NOT_A_COMMAND = 15,
    NOT_A_GUILD_MEMBER = 16,
    NOT_A_USER = 17,
    NOT_A_MESSAGE = 18,
    NOT_A_ROLE = 19
}
