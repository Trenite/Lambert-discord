"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LambertMessage = void 0;
const discord_js_1 = require("discord.js");
class LambertMessage extends discord_js_1.Message {
    constructor(client, data, channel) {
        super(client, data, channel);
        // console.log("got Message", data);
    }
}
exports.LambertMessage = LambertMessage;
discord_js_1.Structures.extend("Message", (Message) => {
    return LambertMessage;
});
//# sourceMappingURL=LambertMessage.js.map