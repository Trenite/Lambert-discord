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
const ts_mixer_1 = require("ts-mixer");
const Auth_1 = require("./Auth");
const Provider_1 = require("./Provider");
const LambertError_1 = require("./LambertError");
class LambertGuildMember extends ts_mixer_1.Mixin(discord_js_1.GuildMember, Auth_1.Auth) {
    constructor(client, data, guild) {
        super(client, data, guild);
        this.client = client;
    }
    get data() {
        return Provider_1.Datastore(this.client, [
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
        return super.hasPermission(auth);
    }
    hasAuth(auth, throwError) {
        const _super = Object.create(null, {
            hasAuth: { get: () => super.hasAuth }
        });
        return __awaiter(this, void 0, void 0, function* () {
            var hasAuth = yield _super.hasAuth.call(this, auth, throwError);
            var hasPerm = this.hasPermission(auth);
            if (throwError && !hasPerm)
                throw new LambertError_1.LambertError("Missing permission", auth);
            return hasAuth && hasPerm;
        });
    }
    hasAuths(auths, throwError) {
        const _super = Object.create(null, {
            hasAuths: { get: () => super.hasAuths }
        });
        return __awaiter(this, void 0, void 0, function* () {
            if (!auths)
                return true;
            if (!Array.isArray(auths))
                auths = [auths];
            if (!auths.length)
                return true;
            var hasAuth = yield _super.hasAuths.call(this, auths, throwError);
            var hasPerm = this.hasPermission(auths);
            if (throwError && !hasPerm)
                throw new LambertError_1.LambertError("Missing Permissions", auths);
            return hasAuth && hasPerm;
        });
    }
}
exports.LambertGuildMember = LambertGuildMember;
discord_js_1.Structures.extend("GuildMember", (GuildMember) => {
    return LambertGuildMember;
});
//# sourceMappingURL=LambertGuildMember.js.map