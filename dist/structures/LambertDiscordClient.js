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
        // @ts-ignore
        // this.ws = new LambertWebSocketManager(this);
        this.server = new LambertServer_1.LambertServer(this, options.server);
        this.eventLogger = new Logger_1.ClientEventLogger(this, options.eventLogger);
        this.webhookLogger = new Logger_1.WebhookLogger(options.webhookLogger);
        this.registry = new Registry_1.Registry(Object.assign({ client: this }, options.registry));
        if (!this.options.db)
            this.db = new lambert_db_1.MongoDatabase();
        else
            this.db = this.options.db;
        this.dbSync = new SyncDatabase_1.SyncDatabase(this);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGFtYmVydERpc2NvcmRDbGllbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3RydWN0dXJlcy9MYW1iZXJ0RGlzY29yZENsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxDQUFDLCtCQUErQixDQUFDLENBQUM7QUFDekMseURBQTBFO0FBRTFFLDJDQUF3QztBQUN4QyxpREFBOEM7QUFDOUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLHFCQUFTLENBQUM7QUFDN0IsMkNBQXFEO0FBQ3JELHdEQUEyRTtBQUMzRSxxQ0FBc0Y7QUFDdEYseUNBQXVEO0FBQ3ZELDJDQUF3QztBQUN4Qyw2REFBMEU7QUFFMUUsYUFBYTtBQUNiLE1BQU0sQ0FBQyxPQUFPLEdBQUcsb0JBQU8sQ0FBQztBQWtFekIsTUFBYSxvQkFBcUIsU0FBUSxtQkFBTTtJQUUvQyxZQUFZLE9BQTZCO1FBQ3hDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQThEaEIsYUFBUSxHQUFHLEdBQUcsRUFBRTtZQUNmLFVBQVUsQ0FBQyxHQUFHLEVBQUU7Z0JBQ2YsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqQixDQUFDLEVBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ2IsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUM5QyxDQUFDLENBQUM7UUFsRUQsSUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO1FBRTNCLGFBQWE7UUFDYiwrQ0FBK0M7UUFDL0MsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLDZCQUFhLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN0RCxJQUFJLENBQUMsV0FBVyxHQUFHLElB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