"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
const discord_js_1 = require("discord.js");
const LambertError_1 = require("./LambertError");
class Auth {
    hasAuth(auth, throwError) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.data.auth[auth].get())
                return true;
            if (throwError)
                throw new LambertError_1.LambertError("Missing Permission", auth);
            if (Object.keys(discord_js_1.Permissions.FLAGS).includes(auth))
                return true;
            return false;
        });
    }
    hasAuths(auths, throwError) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!auths)
                return true;
            if (!Array.isArray(auths))
                auths = [auths];
            if (!auths.length)
                return true;
            var perms = yield this.getAuths();
            auths = auths.filter((auth) => !Object.keys(discord_js_1.Permissions.FLAGS).includes(auth));
            var missing = auths.filter((auth) => !!perms[auth]);
            if (throwError && missing.length)
                throw new LambertError_1.LambertError("Missing Permissions", missing);
            return !!missing.length;
        });
    }
    setAuth(auth, value) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.data.auth[auth].set(value);
        });
    }
    getAuths() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.data.auth.get()) || {};
        });
    }
}
exports.Auth = Auth;
//# sourceMappingURL=Auth.js.map