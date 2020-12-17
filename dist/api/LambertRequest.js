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
exports.patchRequest = void 0;
const instanceOf_1 = require("../util/instanceOf");
function patchRequest(req, res, parameter) {
    return __awaiter(this, void 0, void 0, function* () {
        const { client, user, channel, member, message, emoji, guild, role, body } = parameter;
        // fetch will automatically throw an error if entries aren't found
        // resolve will NOT throw an error -> manually throw it
        if (user)
            req.user = (yield client.users.fetch(req.body.user, false));
        if (channel)
            req.channel = yield client.channels.fetch(req.body.channel, false);
        if (message) {
            if (!channel || !req.channel)
                throw "channel must be enabled for message";
            // @ts-ignore check if it is a text channel
            if (!req.channel.messages)
                throw "must be a text channel";
            req.message = yield req.channel.messages.fetch(req.body.message, false);
        }
        if (guild) {
            req.guild = client.guilds.resolve(req.body.guild);
            if (!req.guild)
                throw "guild not found";
            if (!req.guild.available)
                throw "guild is not available";
        }
        if (member) {
            if (!guild || !req.guild)
                throw "guild must be enabled for guildmember";
            req.member = (yield req.guild.members.fetch(req.body.member));
        }
        if (emoji) {
            if (!guild || !req.guild)
                throw "guild must be enabled for emoji";
            req.emoji = req.guild.emojis.resolve(req.body.emoji);
            if (!req.emoji)
                throw "emoji not found";
        }
        if (role) {
            if (!guild || !req.guild)
                throw "guild must be enabled for role";
            req.role = (yield req.guild.roles.fetch(req.body.role));
        }
        req.body.user = req.user;
        req.body.channel = req.channel;
        req.body.message = req.message;
        req.body.guild = req.guild;
        req.body.member = req.member;
        req.body.emoji = req.emoji;
        req.body.role = req.role;
        instanceOf_1.instanceOf(req.body, body);
    });
}
exports.patchRequest = patchRequest;
//# sourceMappingURL=LambertRequest.js.map