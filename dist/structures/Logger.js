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
exports.WebhookLogger = exports.ClientEventLogger = exports.getLoggerLevelsAbove = exports.Logger = void 0;
const LambertWebhook_1 = require("./LambertWebhook");
require("missing-native-js-functions");
const perf_hooks_1 = require("perf_hooks");
const log = console.log;
console.log = function (...args) {
    const location = new Error().stack.split("\n")[2].slice(4);
    log.call(this, ...args, location);
};
class Logger {
    static getColor(level) {
        switch (level) {
            case "fatal":
                return 16715520;
            case "error":
                return 16736000;
            case "warn":
                return 16749568;
            case "info":
                return 28629;
            case "debug":
                return 1;
        }
    }
    static getHexColor(level) {
        // @ts-ignore
        return Logger.getColor(level).toString(16).padStart(6, "0");
    }
}
exports.Logger = Logger;
function getLoggerLevelsAbove(level) {
    let levels = ["debug", "info", "warn", "error", "fatal"];
    return levels.slice(levels.indexOf(level));
}
exports.getLoggerLevelsAbove = getLoggerLevelsAbove;
class ClientEventLogger {
    constructor(client, options) {
        this.client = client;
        this.options = options;
        this.debug = (x) => {
            console.debug(x);
        };
        this.error = (x) => {
            console.error(x);
        };
        this.warn = (x) => {
            console.warn(x);
        };
        this.info = (x) => {
            console.info(x);
        };
        this.invalidated = () => {
            this.error(new Error(`Client Token is invalid`));
        };
        this.ready = () => {
            var _a, _b;
            let seconds = ((perf_hooks_1.performance.now() - this.start) / 1000).toFixed(2);
            this.info(`[Bot] Ready ${(_a = this.client.user) === null || _a === void 0 ? void 0 : _a.tag} (${(_b = this.client.user) === null || _b === void 0 ? void 0 : _b.id}) ✅ in ${seconds} secs`);
        };
    }
    init() {
        if (!this.options)
            this.options = { level: "info" };
        const levels = getLoggerLevelsAbove(this.options.level);
        if (levels.includes("debug"))
            this.debug("[Bot] Starting");
        if (levels.includes("debug"))
            this.client.on("debug", this.debug);
        if (levels.includes("info"))
            this.client.on("ready", this.ready);
        if (levels.includes("error"))
            this.client.on("error", this.error);
        if (levels.includes("warn"))
            this.client.on("warn", this.warn);
        if (levels.includes("fatal"))
            this.client.on("invalidated", this.invalidated);
        this.start = perf_hooks_1.performance.now();
    }
    destroy() {
        this.client.off("debug", this.debug);
        this.client.off("error", this.error);
        this.client.off("warn", this.warn);
        this.client.off("ready", this.ready);
        this.client.off("invalidated", this.invalidated);
    }
}
exports.ClientEventLogger = ClientEventLogger;
const DiscordFormatCharacters = /[_*`]/g;
class WebhookLogger {
    constructor(webhook) {
        this.onLog = (old, chunk) => {
            this.log("info", chunk.toString());
            return old(chunk);
        };
        this.onError = (old, chunk) => {
            this.log("error", chunk.toString());
            return old(chunk);
        };
        if (!webhook)
            return;
        this.webhook = new LambertWebhook_1.LambertWebhookClient(webhook);
    }
    init() {
        if (!this.webhook)
            return;
        process.stdout.write = this.onLog.bind(this, process.stdout.write);
        process.stderr.write = this.onError.bind(this, process.stderr.write);
    }
    destroy() {
        process.stdout.off("data", this.onLog);
        process.stderr.off("data", this.onError);
        this.webhook.destroy();
        this.webhook = null;
        this.lastMessage = null;
    }
    log(level, val) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            const color = Logger.getHexColor(level);
            val = val.replace(DiscordFormatCharacters, "\\$&");
            let description = "```\n" + val.slice(0, 2039) + "\n```"; // description limit: 2048
            let options = {
                embeds: [
                    {
                        description,
                        color,
                    },
                ],
            };
            let promise;
            if (this.lastMessage &&
                // @ts-ignore
                this.lastMessage.level === level &&
                (((_b = (_a = this.lastMessage) === null || _a === void 0 ? void 0 : _a.embeds.first()) === null || _b === void 0 ? void 0 : _b.description) + description).length < 2048) {
                options.embeds.last().description =
                    "```\n" + ((_e = (_d = (_c = this.lastMessage) === null || _c === void 0 ? void 0 : _c.embeds.first()) === null || _d === void 0 ? void 0 : _d.description) === null || _e === void 0 ? void 0 : _e.slice(4, -4)) + "\n" + val + "\n```";
                promise = this.webhook.editMessage(this.lastMessage.id, options);
                // @ts-ignore
                this.lastMessage = Object.assign(Object.assign({}, this.lastMessage), { embeds: options.embeds, level });
            }
            else {
                promise = this.webhook.send(options).then((e) => {
                    // @ts-ignore
                    this.lastMessage = Object.assign(Object.assign({}, e), { level });
                });
            }
            yield promise.catch((e) => {
                // CANT LOG -> infinite recursion
                // console.error("there was an error sending logs to the webhook\n", e);
            });
        });
    }
}
exports.WebhookLogger = WebhookLogger;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9nZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3N0cnVjdHVyZXMvTG9nZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUdBLHFEQUF3RDtBQUN4RCx1Q0FBcUM7QUFDckMsMkNBQXlDO0FBVXpDLE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUM7QUFDeEIsT0FBTyxDQUFDLEdBQUcsR0FBRyxVQUFVLEdBQUcsSUFBVztJQUNyQyxNQUFNLFFBQVEsR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzNELEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ25DLENBQUMsQ0FBQztBQUVGLE1BQXNCLE1BQU07SUFDM0IsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFhO1FBQzVCLFFBQVEsS0FBSyxFQUFFO1lBQ2QsS0FBSyxPQUFPO2dCQUNYLE9BQU8sUUFBUSxDQUFDO1lBQ2pCLEtBQUssT0FBTztnQkFDWCxPQUFPLFFBQVEsQ0FBQztZQUNqQixLQUFLLE1BQU07Z0JBQ1YsT0FBTyxRQUFRLENBQUM7WUFDakIsS0FBSyxNQUFNO2dCQUNWLE9BQU8sS0FBSyxDQUFDO1lBQ2QsS0FBSyxPQUFPO2dCQUNYLE9BQU8sQ0FBQyxDQUFDO1NBQ1Y7SUFDRixDQUFDO0lBRUQsTUFBTSxDQUFDLFdBQVcsQ0FBQyxLQUFhO1FBQy9CLGFBQWE7UUFDYixPQUFPLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDN0QsQ0FBQztDQUNEO0FBcEJELHdCQW9CQztBQUVELFNBQWdCLG9C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