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
        return __awaiter(this, void 0, void 0, function* () {
            if (!cmd || !(cmd instanceof Command_1.Command))
                return; // emit unkown cmd
            try {
                yield cmd.check(trigger);
                const parsedArgs = yield cmd.getArgs({ trigger, args });
                // get arguments
                yield cmd._exec(trigger, parsedArgs);
            }
            catch (error) {
                let content = "There was an error processing the command";
                let options = {};
                if (error instanceof LambertError_1.LambertError) {
                    if (!trigger.guild) {
                        // -> trigger is a message in a dm channel
                        trigger = trigger;
                    }
                    else {
                    }
                }
                yield trigger.ack({ showUsage: false, dm: true, replyIfError: true }, content, options).catch((e) => { });
            }
        });
    }
    destroy() {
        this.client.off("message", this.onMessage);
    }
}
exports.CommandDispatcher = CommandDispatcher;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tbWFuZERpc3BhdGNoZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3RydWN0dXJlcy9Db21tYW5kRGlzcGF0Y2hlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFDQSx1Q0FBb0M7QUFDcEMsaURBQXNEO0FBTXRELHVGQUF1RjtBQUV2RixNQUFhLGlCQUFpQjtJQUc3QixZQUFvQixNQUE0QjtRQUE1QixXQUFNLEdBQU4sTUFBTSxDQUFzQjtRQVVoRCxrQkFBYSxHQUFHLENBQU8sV0FBK0IsRUFBRSxFQUFFO1lBQ3pELElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLEdBQUcsRUFBRSxXQUFXLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQy9FLENBQUMsQ0FBQSxDQUFDO1FBRUYsY0FBUyxHQUFHLENBQU8sT0FBZ0IsRUFBRSxFQUFFOztZQUN0QyxJQUFJLENBQUMsT0FBTztnQkFBRSxPQUFPO1lBQ3JCLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTTtnQkFBRSxPQUFPO1lBQ3pCLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQUUsT0FBTztZQUN0RCxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU07Z0JBQUUsT0FBTztZQUM1QixJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTTtnQkFBRSxPQUFPO1lBQ2xDLElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLFlBQUssSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLDBDQUFFLEVBQUUsQ0FBQTtnQkFBRSxPQUFPO1lBQ3ZELElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHO2dCQUFFLE9BQU87WUFFL0IsSUFBSSxNQUFNLGVBQUcsT0FBTyxDQUFDLEtBQUssMENBQUUs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