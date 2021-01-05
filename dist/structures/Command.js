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
exports.Command = void 0;
const discord_js_1 = require("discord.js");
const Argument_1 = require("./Argument");
const Handler_1 = require("./Handler");
const CommandInteraction_1 = require("./CommandInteraction");
const LambertError_1 = require("./LambertError");
const ARGSSPLIT = /("(.+)")|([^\n\s]+)/g;
class Command extends Handler_1.Handler {
    constructor(props) {
        var _a;
        super({ id: props.id });
        this.aliases = [];
        this.categoryId = "";
        this.description = "";
        this.details = "";
        this.guarded = false;
        this.guildOnly = false;
        this.hidden = false;
        this.nsfw = false;
        this._throttles = new Map();
        this._globalThrottle = { start: Date.now(), usages: 0, timeout: undefined };
        this.clientPermissions = [];
        this.userPermissions = [];
        this.client = props.client || props.handler.client;
        this.description = props.description || "";
        this.details = props.details || "";
        this.categoryId = props.category || "default";
        this.guarded = props.guarded || false;
        this.guildOnly = props.guildOnly || false;
        this.hidden = props.hidden || false;
        this.nsfw = props.nsfw || false;
        this.throttling = props.throttling;
        this.autoAcknowledge = (_a = props.autoAcknowledge) !== null && _a !== void 0 ? _a : true;
        this.globalThrottling = props.globalThrottling;
        this.clientPermissions = props.clientPermissions || [];
        this.userPermissions = props.userPermissions || [];
        this.args = (props.args || []).map((x) => new Argument_1.Argument(this, x));
        this.aliases = (props.aliases || []).map((x) => x.toLowerCase());
        if (this.id.includes("-"))
            this.aliases.push(this.id.replaceAll("-", ""));
        for (const alias of this.aliases) {
            if (alias.includes("-"))
                this.aliases.push(alias.replaceAll("-", ""));
        }
    }
    _exec(trigger, args) {
        for (const key in args) {
            const val = args[key];
            if (!val)
                continue;
            const arg = this.args.find((x) => x.id === key);
            if (!arg)
                continue;
            if (arg.type.id === "subcommmand") {
                return val.subcommand._exec(trigger, val.subargs);
            }
        }
    }
    exec(trigger, args) {
        throw new Error("Please make a exec() method in command " + this.id);
    }
    throttle(userID) {
        // TODO: if owner, always return false
        const time = (start, duration) => {
            let t = ((Date.now() - start - 100 * 1000) / 1000) * -1;
            return t < 0 ? 0 : t;
        };
        if (this.globalThrottling) {
            let throttle = this._globalThrottle;
            if (!throttle) {
                throttle = {
                    start: Date.now(),
                    usages: 0,
                    timeout: this.client.setTimeout(() => {
                        this._globalThrottle = undefined;
                    }, this.globalThrottling.duration * 1000),
                };
            }
            if (throttle.usages++ > this.globalThrottling.usages)
                return time(throttle.start, this.globalThrottling.duration);
        }
        if (this.throttling) {
            let throttle = this._throttles.get(userID);
            if (!throttle) {
                throttle = {
                    start: Date.now(),
                    usages: 0,
                    timeout: this.client.setTimeout(() => {
                        this._throttles.delete(userID);
                    }, this.throttling.duration * 1000),
                };
                this._throttles.set(userID, throttle);
            }
            if (throttle.usages++ > this.throttling.usages)
                return time(throttle.start, this.throttling.duration);
        }
        return 0;
    }
    getModule(id) {
        id = id.toLowerCase();
        if (this.id === id)
            return this;
        if (this.aliases.includes(id))
            return this;
    }
    check(trigger) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const throttleTime = this.throttle(((_a = trigger.author) === null || _a === void 0 ? void 0 : _a.id) || ((_b = trigger.member) === null || _b === void 0 ? void 0 : _b.id));
            if (throttleTime) {
                throw new LambertError_1.LambertError(LambertError_1.ERRORS.THROTTLED, { user: trigger, time: throttleTime });
            }
            const botMember = (_c = trigger.guild) === null || _c === void 0 ? void 0 : _c.members.resolve(this.client.user.id);
            if (botMember)
                yield botMember.hasAuths(this.clientPermissions, true);
            if (trigger.member)
                yield trigger.member.hasAuths(this.userPermissions, true);
            if (trigger.channel.nsfw && !this.nsfw)
                throw new LambertError_1.LambertError(LambertError_1.ERRORS.NOT_A_NSFW_CHANNEL, { command: this, trigger, channel: trigger.channel });
            if (!trigger.guild && this.guildOnly)
                throw new LambertError_1.LambertError(LambertError_1.ERRORS.GUILD_ONLY, { command: this, trigger });
        });
    }
    getArgs({ trigger, args }) {
        return __awaiter(this, void 0, void 0, function* () {
            let parsedArgs = {};
            if (trigger instanceof discord_js_1.Message) {
                args = args;
                let parts = args.match(ARGSSPLIT);
                const wait = parts
                    .map((arg, index) => {
                    if (index == this.args.length - 1)
                        return parts.slice(index).map(trim).join(" ");
                    return parts[index];
                })
                    .map((x, index) => __awaiter(this, void 0, void 0, function* () {
                    let arg = this.args[index];
                    parsedArgs[arg.id] = yield arg.type.parse({ val: trim(x), trigger, cmd: this });
                }));
                yield Promise.all(wait);
            }
            else if (trigger instanceof CommandInteraction_1.CommandInteraction) {
                parsedArgs = yield trigger.getArgs();
            }
            else
                throw new Error("Unkown Command Trigger");
            for (const arg of this.args) {
                const val = parsedArgs[arg.id];
                if (arg.required && val == null)
                    throw new LambertError_1.LambertError(LambertError_1.ERRORS.ARGUMENT_REQUIRED, { argument: arg, cmd: this, trigger });
                if (arg.default && val == null)
                    parsedArgs[arg.id] = arg.default;
                if (arg.max && val > arg.max)
                    throw new LambertError_1.LambertError(LambertError_1.ERRORS.ARGUMENT_TOO_BIG, { argument: arg, cmd: this, trigger });
                if (arg.min && val > arg.min)
                    throw new LambertError_1.LambertError(LambertError_1.ERRORS.ARGUMENT_TOO_SMALL, { argument: arg, cmd: this, trigger });
            }
            return parsedArgs;
        });
    }
    toSlashCommand() {
        const options = this.args.map((x) => {
            let choices = [];
            if (x.type.id === "union")
                choices = x.default.map((x) => ({ name: x, value: typeof x }));
            return {
                type: x.type.slashType,
                name: x.id,
                description: x.description,
                required: x.required,
                choices,
            };
        });
        return {
            name: this.id,
            description: this.description,
            options,
        };
    }
}
exports.Command = Command;
function trim(x) {
    if (x.startsWith('"') && x.endsWith('"'))
        return x.slice(1, x.length - 2).trim();
    return x.trim();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tbWFuZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdHJ1Y3R1cmVzL0NvbW1hbmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsMkNBQThEO0FBRTlELHlDQUF1RDtBQUN2RCx1Q0FBb0M7QUFJcEMsNkRBQW1IO0FBQ25ILGlEQUFzRDtBQXVDdEQsTUFBTSxTQUFTLEdBQUcsc0JBQXNCLENBQUM7QUFFekMsTUFBc0IsT0FBUSxTQUFRLGlCQUFnQjtJQXNCckQsWUFBWSxLQUFxQjs7UUFDaEMsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBbkJsQixZQUFPLEdBQWEsRUFBRSxDQUFDO1FBQ3ZCLGVBQVUsR0FBVyxFQUFFLENBQUM7UUFJeEIsZ0JBQVcsR0FBVyxFQUFFLENBQUM7UUFDekIsWUFBTyxHQUFXLEVBQUUsQ0FBQztRQUNyQixZQUFPLEdBQVksS0FBSyxDQUFDO1FBQ3pCLGNBQVMsR0FBWSxLQUFLLENBQUM7UUFDM0IsV0FBTSxHQUFZLEtBQUssQ0FBQztRQUN4QixTQUFJLEdBQVksS0FBSyxDQUFDO1FBR2IsZUFBVSxHQUEyQixJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ3hELG9CQUFlLEdBQWUsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxDQUFDO1FBQ25GLHNCQUFpQixHQUFnQyxFQUFFLENBQUM7UUFDcEQsb0JBQWUsR0FBZ0MsRUFBRSxDQUFDO1FBSXhELElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztRQUNuRCxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQyxXQUFXLElBQUksRUFBRSxDQUFDO1FBQzNDLElBQUksQ0FBQyxPQUFPLEdBQUcs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