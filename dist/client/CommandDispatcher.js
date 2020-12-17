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
exports.CommandDispatcher = void 0;
const discord_js_1 = require("discord.js");
const Command_1 = require("../structures/Command");
const LambertError_1 = require("../structures/LambertError");
class CommandDispatcher {
    constructor(client) {
        this.client = client;
        this.cmdMessages = new discord_js_1.Collection();
    }
    init() {
        this.client.on("message", this.onMessage);
    }
    onMessage(m) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            const message = m;
            if (!message)
                return;
            if (!message.author)
                return;
            if (message.author.system)
                return;
            if (message.author.id === ((_a = this.client.user) === null || _a === void 0 ? void 0 : _a.id))
                return;
            if (message.author.bot)
                return;
            let prefix = (_c = (_b = message.guild) === null || _b === void 0 ? void 0 : _b.prefix) !== null && _c !== void 0 ? _c : this.client.options.commandPrefix;
            const usedPrefix = message.content.startsWith(prefix);
            const mention = `<@${(_d = this.client.user) === null || _d === void 0 ? void 0 : _d.id}`;
            const wasMentioned = message.content.startsWith(mention);
            if (wasMentioned)
                prefix = mention;
            if (!wasMentioned && !usedPrefix)
                return;
            const cmdName = message.content.slice(prefix.length);
            const cmd = this.client.registry.commands.getModule(cmdName);
            const command = cmd;
            if (!cmd || !(cmd instanceof Command_1.Command))
                return; // emit unkown cmd
            const throttleTime = cmd.throttle(message.author.id);
            if (throttleTime) {
                throw new LambertError_1.LambertError(LambertError_1.ERRORS.THROTTLED, { user: message.author, time: throttleTime });
            }
            const botMember = (_e = message.guild) === null || _e === void 0 ? void 0 : _e.member(this.client.user.id);
            if (botMember)
                yield botMember.hasAuths(cmd.clientPermissions, true);
            if (message.member)
                yield message.member.hasAuths(cmd.userPermissions, true);
            if (message.channel.nsfw && !cmd.nsfw)
                throw new LambertError_1.LambertError(LambertError_1.ERRORS.NOT_NSFW_CHANNEL, { command, message, channel: message.channel });
            if (!message.guild && cmd.guildOnly)
                throw new LambertError_1.LambertError(LambertError_1.ERRORS.GUILD_ONLY, { command, message });
            cmd.exec();
        });
    }
    destroy() {
        this.client.off("message", this.onMessage);
    }
}
exports.CommandDispatcher = CommandDispatcher;
//# sourceMappingURL=CommandDispatcher.js.map