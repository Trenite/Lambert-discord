"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LambertUser = void 0;
const discord_js_1 = require("discord.js");
const Provider_1 = require("./Provider");
const ts_mixer_1 = require("ts-mixer");
const Auth_1 = require("./Auth");
class LambertUser extends ts_mixer_1.Mixin(discord_js_1.User, Auth_1.Auth) {
    constructor(client, data) {
        super(client, data);
        this.client = client;
    }
    get data() {
        return Provider_1.Datastore(this.client, [{ name: "users", filter: { id: this.id } }]);
    }
}
exports.LambertUser = LambertUser;
discord_js_1.Structures.extend("User", (User) => {
    return LambertUser;
});
//# sourceMappingURL=LambertUser.js.map