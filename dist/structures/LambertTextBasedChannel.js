"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
let oldSend = discord_js_1.TextBasedChannel.prototype.send;
discord_js_1.TextBasedChannel.prototype.send = function (content, options) {
    var _a;
    if (!options && typeof content === "object" && !Array.isArray(content)) {
        options = content;
        content = undefined;
    }
    const opts = discord_js_1.APIMessage.transformOptions(content, options, {}, false);
    const transformed = (_a = this.client) === null || _a === void 0 ? void 0 : _a.registry.messageTransformer.call(this, opts);
    return oldSend(null, transformed);
};
//# sourceMappingURL=LambertTextBasedChannel.js.map