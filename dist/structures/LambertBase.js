"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LambertBase = void 0;
const discord_js_1 = require("discord.js");
class LambertBase extends discord_js_1.Base {
    constructor(client) {
        super(client);
    }
}
exports.LambertBase = LambertBase;
discord_js_1.Structures.extend("Base", (base) => {
    return LambertBase;
});
//# sourceMappingURL=LambertBase.js.map