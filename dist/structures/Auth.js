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
                throw new LambertError_1.LambertError(LambertError_1.ERRORS.MISSING_PERMISSION, auth);
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
                throw new LambertError_1.LambertError(LambertError_1.ERRORS.MISSING_PERMISSIONS, missing);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXV0aC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdHJ1Y3R1cmVzL0F1dGgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsMkNBQXlDO0FBQ3pDLGlEQUFzRDtBQUV0RCxNQUFhLElBQUk7SUFJVixPQUFPLENBQUMsSUFBWSxFQUFFLFVBQW9COztZQUMvQyxJQUFJLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFO2dCQUFFLE9BQU8sSUFBSSxDQUFDO1lBQ2xELElBQUksVUFBVTtnQkFBRSxNQUFNLElBQUksMkJBQVksQ0FBQyxxQkFBTSxDQUFDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3hFLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyx3QkFBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7Z0JBQUUsT0FBTyxJQUFJLENBQUM7WUFDL0QsT0FBTyxLQUFLLENBQUM7UUFDZCxDQUFDO0tBQUE7SUFFSyxRQUFRLENBQUMsS0FBd0IsRUFBRSxVQUFvQjs7WUFDNUQsSUFBSSxDQUFDLEtBQUs7Z0JBQUUsT0FBTyxJQUFJLENBQUM7WUFDeEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO2dCQUFFLEtBQUssR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzNDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTTtnQkFBRSxPQUFPLElBQUksQ0FBQztZQUMvQixJQUFJLEtBQUssR0FBRyxNQUFNLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNsQyxLQUFLLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLHdCQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFFL0UsSUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3BELElBQUksVUFBVSxJQUFJLE9BQU8sQ0FBQyxNQUFNO2dCQUFFLE1BQU0sSUFBSSwyQkFBWSxDQUFDLHFCQUFNLENBQUMsbUJBQW1CLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDOUYsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztRQUN6QixDQUFDO0tBQUE7SUFFSyxPQUFPLENBQUMsSUFBWSxFQUFFLEtBQWM7O1lBQ3pDLE9BQWdCLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3ZELENBQUM7S0FBQTtJQUVLLFFBQVE7O1lBQ2IsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDM0MsQ0FBQztLQUFBO0NBQ0Q7QUE5QkQsb0JBOEJDIn0=