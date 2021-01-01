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
const Command_1 = require("./Command");
const LambertError_1 = require("./LambertError");
// TODO: create a class CommandTrigger so that both interaction and message event works
class CommandDispatcher {
    constructor(client) {
        this.client = client;
        this.onInteraction = (interaction) => __awaiter(this, void 0, void 0, function* () {
            this.checkCmd({ trigger: interaction, cmd: interaction.command, args: null });
        });
        this.onMessage = (message) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            if (!message)
                return;
            if (!this.client)
                return;
            if (!this.client.user || !this.client.user.id)
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
            const wasMentioned = message.content.match(this.mention);
            if (wasMentioned)
                prefix = wasMentioned.first();
            if (!wasMentioned && !usedPrefix)
                return;
            message.prefix = prefix;
            const content = message.content.slice(prefix.length);
            const cmdName = content.split(" ").first();
            message.cmdName = cmdName;
            const args = content.slice(cmdName.length).trim();
            const cmd = this.client.registry.commands.getModule(cmdName);
            message.cmd = cmd;
            return this.checkCmd({ cmd, trigger: message, args });
        });
        this.client = client;
    }
    init() {
        var _a;
        this.mention = new RegExp(`^<@!?${(_a = this.client.user) === null || _a === void 0 ? void 0 : _a.id}>\\s?`, "i");
        this.client.on("message", this.onMessage);
        this.client.on("interactionCreate", this.onInteraction);
    }
    checkCmd({ cmd, trigger, args, }) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            if (!cmd || !(cmd instanceof Command_1.Command))
                return; // emit unkown cmd
            try {
                const throttleTime = cmd.throttle(((_a = trigger.author) === null || _a === void 0 ? void 0 : _a.id) || ((_b = trigger.member) === null || _b === void 0 ? void 0 : _b.id));
                if (throttleTime) {
                    throw new LambertError_1.LambertError(LambertError_1.ERRORS.THROTTLED, { user: trigger, time: throttleTime });
                }
                const botMember = ((_c = trigger.guild) === null || _c === void 0 ? void 0 : _c.members.resolve(this.client.user.id));
                if (botMember)
                    yield botMember.hasAuths(cmd.clientPermissions, true);
                if (trigger.member)
                    yield trigger.member.hasAuths(cmd.userPermissions, true);
                if (trigger.channel.nsfw && !cmd.nsfw)
                    throw new LambertError_1.LambertError(LambertError_1.ERRORS.NOT_NSFW_CHANNEL, { command: cmd, trigger, channel: trigger.channel });
                if (!trigger.guild && cmd.guildOnly)
                    throw new LambertError_1.LambertError(LambertError_1.ERRORS.GUILD_ONLY, { command: cmd, trigger });
                const parsedArgs = yield cmd.getArgs({ cmd, trigger, args });
                // get arguments
                yield cmd.exec(trigger, parsedArgs);
            }
            catch (error) {
                const content = "There was an error processing the command";
                yield trigger.ack({ showUsage: false, dm: true, replyIfError: true }, content).catch((e) => { });
            }
        });
    }
    destroy() {
        this.client.off("message", this.onMessage);
    }
}
exports.CommandDispatcher = CommandDispatcher;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tbWFuZERpc3BhdGNoZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3RydWN0dXJlcy9Db21tYW5kRGlzcGF0Y2hlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFDQSx1Q0FBb0M7QUFDcEMsaURBQXNEO0FBTXRELHVGQUF1RjtBQUV2RixNQUFhLGlCQUFpQjtJQUc3QixZQUFvQixNQUE0QjtRQUE1QixXQUFNLEdBQU4sTUFBTSxDQUFzQjtRQVVoRCxrQkFBYSxHQUFHLENBQU8sV0FBK0IsRUFBRSxFQUFFO1lBQ3pELElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLEdBQUcsRUFBRSxXQUFXLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQy9FLENBQUMsQ0FBQSxDQUFDO1FBRUYsY0FBUyxHQUFHLENBQU8sT0FBZ0IsRUFBRSxFQUFFOztZQUN0QyxJQUFJLENBQUMsT0FBTztnQkFBRSxPQUFPO1lBQ3JCLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTTtnQkFBRSxPQUFPO1lBQ3pCLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQUUsT0FBTztZQUN0RCxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU07Z0JBQUUsT0FBTztZQUM1QixJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTTtnQkFBRSxPQUFPO1lBQ2xDLElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLFlBQUssSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLDBDQUFFLEVBQUUsQ0FBQTtnQkFBRSxPQUFPO1lBQ3ZELElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHO2dCQUFFLE9BQU87WUFFL0IsSUFBSSxNQUFNLGVBQUcsT0FBTyxDQUFDLEtBQUssMENBQUUs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