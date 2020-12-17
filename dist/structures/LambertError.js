"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERRORS = exports.LambertError = void 0;
class LambertError extends Error {
    constructor(code, data) {
        super(ERRORS[code]);
        this.code = code;
        this.data = data;
    }
}
exports.LambertError = LambertError;
var ERRORS;
(function (ERRORS) {
    ERRORS[ERRORS["NOT_NSFW_CHANNEL"] = 0] = "NOT_NSFW_CHANNEL";
    ERRORS[ERRORS["THROTTLED"] = 1] = "THROTTLED";
    ERRORS[ERRORS["GUILD_ONLY"] = 2] = "GUILD_ONLY";
})(ERRORS = exports.ERRORS || (exports.ERRORS = {}));
//# sourceMappingURL=LambertError.js.map