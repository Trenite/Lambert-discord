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
exports.LambertGuildMember = void 0;
const discord_js_1 = require("discord.js");
const Auth_1 = require("./Auth");
const LambertError_1 = require("./LambertError");
const lambert_db_1 = require("lambert-db");
class LambertGuildMember {
    get data() {
        return lambert_db_1.Datastore(this.client.db, [
            { name: "guilds", filter: { id: this.guild.id } },
            { name: "members", filter: { id: this.id } },
        ]);
    }
    hasPermission(auth) {
        if (typeof auth === "string")
            if (!Object.keys(discord_js_1.Permissions.FLAGS).includes(auth))
                return true;
        if (Array.isArray(auth))
            auth = auth.filter((auth) => Object.keys(discord_js_1.Permissions.FLAGS).includes(auth));
        return oldHasPermission(auth);
    }
    hasAuth(auth, throwError) {
        return __awaiter(this, void 0, void 0, function* () {
            // @ts-ignore
            var hasAuth = yield Auth_1.Auth.prototype.hasAuth.call(this, auth, throwError);
            var hasPerm = this.hasPermission(auth);
            if (throwError && !hasPerm)
                throw new LambertError_1.LambertError(LambertError_1.ERRORS.MISSING_PERMISSION, auth);
            return hasAuth && hasPerm;
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
            // @ts-ignore
            var hasAuth = Auth_1.Auth.prototype.hasAuths.call(this, auths, throwError);
            var hasPerm = this.hasPermission(auths);
            if (throwError && !hasPerm)
                throw new LambertError_1.LambertError(LambertError_1.ERRORS.MISSING_PERMISSIONS, auths);
            return hasAuth && hasPerm;
        });
    }
}
exports.LambertGuildMember = LambertGuildMember;
discord_js_1.GuildMember.prototype.hasAuths = LambertGuildMember.prototype.hasAuths;
discord_js_1.GuildMember.prototype.hasAuth = LambertGuildMember.prototype.hasAuth;
const oldHasPermission = discord_js_1.GuildMember.prototype.hasPermission;
discord_js_1.GuildMember.prototype.hasPermission = LambertGuildMember.prototype.hasPermission;
Object.defineProperties(discord_js_1.GuildMember.prototype, {
    hasAuths: Object.getOwnPropertyDescriptor(LambertGuildMember.prototype, "hasAuths"),
    hasAuth: Object.getOwnPropertyDescriptor(LambertGuildMember.prototype, "hasAuth"),
    hasPermission: Object.getOwnPropertyDescriptor(LambertGuildMember.prototype, "hasPermission"),
    data: Object.getOwnPropertyDescriptor(LambertGuildMember.prototype, "data"),
});
// TODO: proper patch function (this problem)
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGFtYmVydEd1aWxkTWVtYmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3N0cnVjdHVyZXMvTGFtYmVydEd1aWxkTWVtYmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLDJDQUE4RTtBQUM5RSxpQ0FBOEI7QUFDOUIsaURBQXNEO0FBQ3RELDJDQUF1QztBQWN2QyxNQUFhLGtCQUFrQjtJQUM5QixJQUFXLElBQUk7UUFDZCxPQUFPLHNCQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUU7WUFDaEMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFO1lBQ2pELEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRSxFQUFFO1NBQzVDLENBQUMsQ0FBQztJQUNKLENBQUM7SUFFRCxhQUFhLENBQUMsSUFBMkM7UUFDeEQsSUFBSSxPQUFPLElBQUksS0FBSyxRQUFRO1lBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsd0JBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO2dCQUFFLE9BQU8sSUFBSSxDQUFDO1FBQzlGLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7WUFBRSxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyx3QkFBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBRXJHLE9BQU8sZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUVLLE9BQU8sQ0FBQyxJQUFZLEVBQUUsVUFBb0I7O1lBQy9DLGFBQWE7WUFDYixJQUFJLE9BQU8sR0FBRyxNQUFNLFdBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQ3hFLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQW1CLElBQUksQ0FBQyxDQUFDO1lBQ3pELElBQUksVUFBVSxJQUFJLENBQUMsT0FBTztnQkFBRSxNQUFNLElBQUksMkJBQVksQ0FBQyxxQkFBTSxDQUFDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3BGLE9BQU8sT0FBTyxJQUFJLE9BQU8sQ0FBQztRQUMzQixDQUFDO0tBQUE7SUFFSyxRQUFRLENBQUMsS0FBd0IsRUFBRSxVQUFvQjs7WUFDNUQsSUFBSSxDQUFDLEtBQUs7Z0JBQUUsT0FBTyxJQUFJLENBQUM7WUFDeEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO2dCQUFFLEtBQUssR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzNDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTTtnQkFBRSxPQUFPLElBQUksQ0FBQztZQUUvQixhQUFhO1lBQ2IsSUFBSSxPQUFPLEdBQUcsV0FBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFDcEUsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBcUIsS0FBSyxDQUFDLENBQUM7WUFDNUQsSUFBSSxVQUFVLElBQUksQ0FBQyxPQUFPO2dCQUFFLE1BQU0sSUFBSSwyQkFBWSxDQUFDLHFCQUFNLENBQUMsbUJBQW1CLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDdEYsT0FBTyxPQUFPLElBQUksT0FBTyxDQUFDO1FBQzNCLENBQUM7S0FBQTtDQUNEO0FBbENELGdEQWtDQztBQUVELHdCQUFXLENBQUMsU0FBUyxDQUFDLFFBQVEsR0FBRyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDO0FBQ3ZFLHdCQUFXLENBQUMsU0FBUyxDQUFDLE9BQU8sR0FBRyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDO0FBQ3JFLE1BQU0sZ0JBQWdCLEdBQUcsd0JBQVcsQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDO0FBQzdELHdCQUFXLENBQUMsU0FBUyxDQUFDLGFBQWEsR0FBRyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDO0FBRWpGLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyx3QkFBVyxDQUFDLFNBQVMsRUFBRTtJQUM5QyxRQUFRLEVBQUUsTUFBTSxDQUFDLHdCQUF3QixDQUFDLGtCQUFrQixDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUM7SUFDbkYsT0FBTyxFQUFFLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDO0lBQ2pGLGFBQWEsRUFBRSxNQUFNLENBQUMsd0JBQXdCLENBQUMsa0JBQWtCLENBQUMsU0FBUyxFQUFFLGVBQWUsQ0FBQztJQUM3RixJQUFJLEVBQUUsTUFBTSxDQUFDLHdCQUF3QixDQUFDLGtCQUFrQixDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUM7Q0FDM0UsQ0FBQyxDQUFDO0FBQ0gsNkNBQTZDIn0=