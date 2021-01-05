"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.LambertDiscordClient = void 0;
require("../structures/LambertExtended");
const discord_js_1 = __importStar(require("discord.js"));
const Constants_1 = require("./Constants");
const SyncDatabase_1 = require("./SyncDatabase");
const { Events } = Constants_1.Constants;
const lambert_db_1 = require("lambert-db");
const LambertServer_1 = require("../api/LambertServer");
const Logger_1 = require("./Logger");
const Registry_1 = require("./Registry");
const discord_js_2 = require("discord.js");
const CommandInteraction_1 = require("./CommandInteraction");
// @ts-ignore
global.Discord = discord_js_1.default;
class LambertDiscordClient extends discord_js_1.Client {
    constructor(options) {
        super(options);
        this.shutdown = () => {
            setTimeout(() => {
                process.exit(1);
            }, 1000 * 4);
            this.destroy().finally(() => process.exit());
        };
        this.token = options.token;
        this.server = new LambertServer_1.LambertServer(this, options.server);
        this.eventLogger = new Logger_1.ClientEventLogger(this, options.eventLogger);
        this.webhookLogger = new Logger_1.WebhookLogger(options.webhookLogger);
        this.registry = new Registry_1.Registry(Object.assign({ client: this }, options.registry));
        if (!this.options.db)
            this.db = new lambert_db_1.MongoDatabase();
        else
            this.db = this.options.db;
        this.dbSync = new SyncDatabase_1.SyncDatabase(this);
        // this.lang = i18next.createInstance({});
        process.on("SIGINT", this.shutdown);
        global.client = this;
        this.initalized = this.init();
    }
    get data() {
        return this.db.data;
    }
    init() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            this.emit(Events.DEBUG, "intializing Lambert client");
            this.server.init(); // do not await server intializing, because server is waiting for client to initalize
            this.user = new discord_js_2.ClientUser(this, yield this.api.users("@me").get());
            if (!this.options.application_id)
                this.options.application_id = this.user.id;
            yield Promise.all([
                this.db.init(),
                this.dbSync.init(),
                this.eventLogger.init(),
                this.webhookLogger.init(),
                this.registry.init(),
            ]);
            if ((_a = this.options.ws) === null || _a === void 0 ? void 0 : _a.autoresume) {
                const shards = (yield this.data.shards.get()) || [];
                var sessionIDs = {};
                shards.forEach((shard) => (sessionIDs[shard.id] = shard.sessionID));
                if (!this.options.ws)
                    this.options.ws = {};
                this.options.ws.sessionIDs = sessionIDs;
            }
            // @ts-ignore
            this.ws.on("INTERACTION_CREATE", (interaction) => __awaiter(this, void 0, void 0, function* () {
                this.emit("interactionCreate", new CommandInteraction_1.CommandInteraction(this, interaction));
            }));
            this.emit(Events.CLIENT_INIT);
        });
    }
    login() {
        const _super = Object.create(null, {
            login: { get: () => super.login }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initalized;
            return _super.login.call(this);
        });
    }
    destroy(keepalive = true, activity) {
        const _super = Object.create(null, {
            destroy: { get: () => super.destroy }
        });
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            process.off("SIGINT", this.shutdown);
            if (keepalive) {
                yield ((_a = this.user) === null || _a === void 0 ? void 0 : _a.setPresence(activity || { status: "dnd", activity: { name: "stopped" } }).catch(() => { }));
            }
            // @ts-ignore
            this.ws.destroy(keepalive);
            _super.destroy.call(this);
            return Promise.all([
                this.db.destroy(),
                this.dbSync.destroy(),
                this.server.destroy(),
                this.eventLogger.destroy(),
                this.webhookLogger.destroy(),
                this.registry.destroy(),
            ]);
        });
    }
}
exports.LambertDiscordClient = LambertDiscordClient;
process.on("uncaughtException", criticalError);
process.on("unhandledRejection", criticalError);
function criticalError(error) {
    let text = `
UNCAUGHT EXCEPTION
There was a critical exception, however Lambert catched it to prevent crashing.
Please catch this error the next time:\n${error && error.stack ? error.stack : error}
`;
    console.error(text);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGFtYmVydERpc2NvcmRDbGllbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3RydWN0dXJlcy9MYW1iZXJ0RGlzY29yZENsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxDQUFDLCtCQUErQixDQUFDLENBQUM7QUFDekMseURBQTBFO0FBRTFFLDJDQUF3QztBQUN4QyxpREFBOEM7QUFDOUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLHFCQUFTLENBQUM7QUFDN0IsMkNBQXFEO0FBQ3JELHdEQUEyRTtBQUMzRSxxQ0FBc0Y7QUFDdEYseUNBQXVEO0FBQ3ZELDJDQUF3QztBQUN4Qyw2REFBMEU7QUFJMUUsYUFBYTtBQUNiLE1BQU0sQ0FBQyxPQUFPLEdBQUcsb0JBQU8sQ0FBQztBQWtFekIsTUFBYSxvQkFBcUIsU0FBUSxtQkFBTTtJQUUvQyxZQUFZLE9BQTZCO1FBQ3hDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQTZEaEIsYUFBUSxHQUFHLEdBQUcsRUFBRTtZQUNmLFVBQVUsQ0FBQyxHQUFHLEVBQUU7Z0JBQ2YsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqQixDQUFDLEVBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ2IsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUM5QyxDQUFDLENBQUM7UUFqRUQsSUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO1FBRTNCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSw2QkFBYSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdEQsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLDBCQUFpQixDQUFDLElBQUksRUFB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