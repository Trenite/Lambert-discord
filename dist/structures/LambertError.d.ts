export declare class LambertError extends Error {
    code: ERRORS;
    data: any;
    constructor(code: ERRORS, data: any);
}
export declare enum ERRORS {
    NOT_NSFW_CHANNEL = 0,
    THROTTLED = 1,
    GUILD_ONLY = 2
}
//# sourceMappingURL=LambertError.d.ts.map