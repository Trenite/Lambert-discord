"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChalkLogger = exports.WebhookLogger = exports.getLoggerLevelsAbove = exports.LambertDiscordClientEventLogger = exports.LoggerCollection = exports.Logger = void 0;
const signale_1 = require("signale");
const JavaScript_1 = require("../util/JavaScript");
const LambertWebhook_1 = require("./LambertWebhook");
JavaScript_1.init();
const inspector_1 = __importDefault(require("inspector"));
const perf_hooks_1 = require("perf_hooks");
class Logger {
    fatal(val, ctx) {
        return this.log("fatal", val, ctx);
    }
    error(val, ctx) {
        return this.log("error", val, ctx);
    }
    warn(val, ctx) {
        return this.log("warn", val, ctx);
    }
    info(val, ctx) {
        return this.log("info", val, ctx);
    }
    debug(val, ctx) {
        return this.log("debug", val, ctx);
    }
    log(level, val, ctx) {
        var _a, _b, _c;
        let str = "";
        if (ctx) {
            if (ctx.cmd)
                str += `[CMD]: ${ctx.cmd.id} `;
            if (ctx.cmd)
                str += `[USER]: ${(_a = ctx.user) === null || _a === void 0 ? void 0 : _a.tag} `;
            if (ctx.cmd)
                str += `[GUILD]: ${(_b = ctx.guild) === null || _b === void 0 ? void 0 : _b.name}(${(_c = ctx.guild) === null || _c === void 0 ? void 0 : _c.id}) `;
        }
        return str + val;
    }
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
class LoggerCollection extends Logger {
    constructor(opts = {}) {
        super();
        this.opts = opts;
        if (!opts.loggers)
            opts.loggers = [];
        this.loggers = opts.loggers;
        opts.loggers.push(new ChalkLogger(opts.level));
    }
    log(level, val, ctx) {
        this.loggers.map((logger) => logger[level](val, ctx));
        return val;
    }
    add(logger) {
        this.loggers.push(logger);
    }
    remove(logger) {
        this.loggers.remove(logger);
    }
}
exports.LoggerCollection = LoggerCollection;
class LambertDiscordClientEventLogger {
    constructor(client) {
        this.client = client;
        this.debug = (x) => {
            this.client.logger.debug(x);
        };
        this.error = (x) => {
            this.client.logger.error(x.toString());
        };
        this.warn = (x) => {
            this.client.logger.warn(x);
        };
        this.info = (x) => {
            this.client.logger.info(x);
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
        this.client.on("debug", this.debug);
        this.client.on("error", this.error);
        this.client.on("warn", this.warn);
        this.client.on("ready", this.ready);
        this.client.on("invalidated", this.invalidated);
        this.info("[Bot] Starting");
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
exports.LambertDiscordClientEventLogger = LambertDiscordClientEventLogger;
function getLoggerLevelsAbove(level) {
    let levels = ["debug", "info", "warn", "error", "fatal"];
    return levels.slice(levels.indexOf(level));
}
exports.getLoggerLevelsAbove = getLoggerLevelsAbove;
const DiscordFormatCharacters = /[_*`]/g;
class WebhookLogger extends Logger {
    constructor(opts) {
        super();
        this.webhooks = {};
        this.level = opts.level;
        Object.keys(opts.loggers).forEach((key) => {
            // @ts-ignore
            this.webhooks[key] = new LambertWebhook_1.LambertWebhookClient(opts.loggers[key]);
        });
    }
    log(level, val, ctx = {}) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const above = getLoggerLevelsAbove(this.level);
        if (!above.includes(level))
            return val;
        const aboveLevel = getLoggerLevelsAbove(level);
        const fallback = aboveLevel
            // @ts-ignore
            .filter((x) => !!this.webhooks[x])
            .first();
        level = this.webhooks[level] ? level : fallback;
        const levelWebhook = this.webhooks[level];
        if (!levelWebhook)
            return val;
        const color = Logger.getHexColor(level);
        if ((_a = ctx.cmd) === null || _a === void 0 ? void 0 : _a.id)
            val += `[${ctx.cmd.id}] `;
        val = val.replace(DiscordFormatCharacters, "\\$&");
        let description = "```\n" + val.slice(0, 2039) + "\n```";
        let options = {
            embeds: [
                {
                    description,
                    color,
                    author: {
                        name: ctx.guild ? `${ctx.guild.name} (${ctx.guild.id})` : undefined,
                        iconURL: ((_b = ctx.guild) === null || _b === void 0 ? void 0 : _b.iconURL({ dynamic: true, format: "jpg", size: 256 })) || undefined,
                    },
                    footer: {
                        text: ctx.user ? `${ctx.user.username} (${ctx.user.id})` : "",
                        iconURL: (_c = ctx.user) === null || _c === void 0 ? void 0 : _c.displayAvatarURL({ dynamic: true, format: "jpg", size: 256 }),
                    },
                },
            ],
        };
        let promise;
        if (this.lastMessage &&
            // @ts-ignore
            this.lastMessage.level === level &&
            // @ts-ignore
            this.lastMessage.ctx.equals(ctx) &&
            (((_e = (_d = this.lastMessage) === null || _d === void 0 ? void 0 : _d.embeds.first()) === null || _e === void 0 ? void 0 : _e.description) + description).length < 2048) {
            options.embeds.last().description =
                "```\n" + ((_h = (_g = (_f = this.lastMessage) === null || _f === void 0 ? void 0 : _f.embeds.first()) === null || _g === void 0 ? void 0 : _g.description) === null || _h === void 0 ? void 0 : _h.slice(4, -4)) + "\n" + val + "\n```";
            // @ts-ignore
            promise = levelWebhook.editMessage(this.lastMessage.id, options);
            // @ts-ignore
            this.lastMessage = Object.assign(Object.assign({}, this.lastMessage), { embeds: options.embeds, level, ctx });
        }
        else {
            promise = levelWebhook.send(options).then((e) => {
                // @ts-ignore
                this.lastMessage = Object.assign(Object.assign({}, e), { level, ctx });
            });
        }
        promise.catch((e) => {
            console.error("there was an error sending logs to the webhook\n", e);
        });
        return val;
    }
}
exports.WebhookLogger = WebhookLogger;
class ChalkLogger extends Logger {
    constructor(level = "info") {
        super();
        this.level = level;
        this.signale = new signale_1.Signale({ logLevel: "info", stream: process.stdout });
    }
    log(level, val, ctx) {
        if (!getLoggerLevelsAbove(this.level).includes(level))
            return val;
        val = super.log(level, val, ctx);
        // @ts-ignore
        var debug = typeof v8debug === "object" || inspector_1.default.url();
        if (debug)
            console.log(val);
        else
            this.signale[level](val);
        return val;
    }
}
exports.ChalkLogger = ChalkLogger;
//# sourceMappingURL=Logger.js.map