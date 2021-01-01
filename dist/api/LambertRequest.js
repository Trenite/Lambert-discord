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
exports.check = exports.patchRequest = void 0;
const instanceOf_1 = require("../util/instanceOf");
const HTTPError_1 = require("./HTTPError");
function patchRequest(req, res, parameter) {
    return __awaiter(this, void 0, void 0, function* () {
        function getValue(val) {
            return req.body[val] || req.headers[val];
        }
        const { client } = req;
        const { user, channel, member, message, emoji, guild, role, body } = parameter;
        if (!instanceOf_1.instanceOf(body, req.body, "body"))
            throw new Error("Invalid Request body");
        // fetch will automatically throw an error if entries aren't found
        // resolve will NOT throw an error -> manually throw it
        if (user)
            req.user = (yield client.users.fetch(getValue("user"), false));
        if (channel)
            req.channel = yield client.channels.fetch(getValue("channel"), false);
        if (message) {
            if (!channel || !req.channel)
                throw new HTTPError_1.HTTPError("channel must be enabled for message");
            // @ts-ignore check if it is a text channel
            if (!req.channel.messages)
                throw new HTTPError_1.HTTPError("must be a text channel");
            req.message = yield req.channel.messages.fetch(getValue("message"), false);
        }
        if (guild) {
            req.guild = client.guilds.resolve(getValue("guild"));
            if (!req.guild)
                throw new HTTPError_1.HTTPError(`body.guild: '${getValue("guild")}' not found`, 404);
            if (!req.guild.available)
                throw new HTTPError_1.HTTPError("guild is not available", 504);
        }
        if (member) {
            if (!guild || !req.guild)
                throw "guild must be enabled for guildmember";
            req.member = yield req.guild.members.fetch(getValue("member"));
        }
        if (emoji) {
            if (!guild || !req.guild)
                throw "guild must be enabled for emoji";
            req.emoji = req.guild.emojis.resolve(getValue("emoji"));
            if (!req.emoji)
                throw new HTTPError_1.HTTPError("emoji not found", 404);
        }
        if (role) {
            if (!guild || !req.guild)
                throw "guild must be enabled for role";
            req.role = (yield req.guild.roles.fetch(getValue("role")));
        }
        // just to be sure if someone thinks the objects are in the request body/header
        req.body.user = req.user;
        req.body.channel = req.channel;
        req.body.message = req.message;
        req.body.guild = req.guild;
        req.body.member = req.member;
        req.body.emoji = req.emoji;
        req.body.role = req.role;
        // @ts-ignore
        req.headers.user = req.user; // @ts-ignore
        req.headers.channel = req.channel; // @ts-ignore
        req.headers.message = req.message; // @ts-ignore
        req.headers.guild = req.guild; // @ts-ignore
        req.headers.member = req.member; // @ts-ignore
        req.headers.emoji = req.emoji; // @ts-ignore
        req.headers.role = req.role;
    });
}
exports.patchRequest = patchRequest;
function check(options) {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        var { permissions } = options;
        if (!permissions)
            permissions = [];
        if (!Array.isArray(permissions))
            permissions = [permissions];
        if (permissions.length && !options.member)
            options.user = true;
        // if (permissions.find((x) => PermissionString))
        yield patchRequest(req, res, options);
        yield ((_a = req.user) === null || _a === void 0 ? void 0 : _a.hasAuths(permissions, true));
        yield ((_b = req.member) === null || _b === void 0 ? void 0 : _b.hasAuths(permissions, true));
        next();
    });
}
exports.check = check;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGFtYmVydFJlcXVlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYXBpL0xhbWJlcnRSZXF1ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUtBLG1EQUFnRDtBQUNoRCwyQ0FBd0M7QUF3Q3hDLFNBQXNCLFlBQVksQ0FBQyxHQUFZLEVBQUUsR0FBYSxFQUFFLFNBQW1DOztRQUNsRyxTQUFTLFFBQVEsQ0FBQyxHQUFXO1lBQzVCLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzFDLENBQUM7UUFFRCxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDO1FBQ3ZCLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEdBQUcsU0FBUyxDQUFDO1FBQy9FLElBQUksQ0FBQyx1QkFBVSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQztZQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUVqRixrRUFBa0U7UUFDbEUsdURBQXVEO1FBQ3ZELElBQUksSUFBSTtZQUFFLEdBQUcsQ0FBQyxJQUFJLElBQWdCLE1BQU0sTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFBLENBQUM7UUFDcEYsSUFBSSxPQUFPO1lBQUUsR0FBRyxDQUFDLE9BQU8sR0FBRyxNQUFNLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNuRixJQUFJLE9BQU8sRUFBRTtZQUNaLElBQUksQ0FBQyxPQUFPLElBQUks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