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
const Argument_1 = require("./Argument");
const Handler_1 = require("./Handler");
const discord_js_1 = require("discord.js");
const CommandInteraction_1 = require("./CommandInteraction");
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
    getArgs({ cmd, trigger, args, }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (trigger instanceof discord_js_1.Message) {
                args = args;
                let parts = args.match(ARGSSPLIT);
                let parsedArgs = {};
                parts
                    .map((arg, index) => {
                    if (index == cmd.args.length - 1)
                        return parts.slice(index).map(trim).join(" ");
                    return parts[index];
                })
                    .forEach((x, index) => {
                    let arg = cmd.args[index];
                    parsedArgs[arg.id] = arg.type.parse({ val: trim(x), trigger, cmd });
                });
                return parsedArgs;
            }
            else if (trigger instanceof CommandInteraction_1.CommandInteraction) {
                return yield trigger.getArgs();
            }
            else
                throw new Error("Unkown Command Trigger");
            // TODO: check if argument is min/max default/required
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tbWFuZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdHJ1Y3R1cmVzL0NvbW1hbmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQ0EseUNBQXVEO0FBQ3ZELHVDQUFvQztBQUdwQywyQ0FBcUM7QUFFckMsNkRBQW1IO0FBc0NuSCxNQUFNLFNBQVMsR0FBRyxzQkFBc0IsQ0FBQztBQUV6QyxNQUFzQixPQUFRLFNBQVEsaUJBQWdCO0lBc0JyRCxZQUFZLEtBQXFCOztRQUNoQyxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFuQmxCLFlBQU8sR0FBYSxFQUFFLENBQUM7UUFDdkIsZUFBVSxHQUFXLEVBQUUsQ0FBQztRQUl4QixnQkFBVyxHQUFXLEVBQUUsQ0FBQztRQUN6QixZQUFPLEdBQVcsRUFBRSxDQUFDO1FBQ3JCLFlBQU8sR0FBWSxLQUFLLENBQUM7UUFDekIsY0FBUyxHQUFZLEtBQUssQ0FBQztRQUMzQixXQUFNLEdBQVksS0FBSyxDQUFDO1FBQ3hCLFNBQUksR0FBWSxLQUFLLENBQUM7UUFHYixlQUFVLEdBQTJCLElBQUksR0FBRyxFQUFFLENBQUM7UUFDeEQsb0JBQWUsR0FBZSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLENBQUM7UUFDbkYsc0JBQWlCLEdBQWdDLEVBQUUsQ0FBQztRQUNwRCxvQkFBZSxHQUFnQyxFQUFFLENBQUM7UUFJeEQsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO1FBQ25ELElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDLFdBQVcsSUFBSSxFQUFFLENBQUM7UUFDM0MsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FB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