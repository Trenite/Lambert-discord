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
exports.LambertDiscordClient = void 0;
require("../structures/LambertExtended");
const discord_js_1 = require("discord.js");
const LambertWebSocketManager_1 = require("./websocket/LambertWebSocketManager");
const Constants_1 = require("../structures/Constants");
const SyncDatabase_1 = require("../controllers/SyncDatabase");
const { Events } = Constants_1.Constants;
const Provider_1 = require("../structures/Provider");
const LambertServer_1 = require("../api/LambertServer");
const MongodbProvider_1 = require("../controllers/MongodbProvider");
const Logger_1 = require("../structures/Logger");
class LambertDiscordClient extends discord_js_1.Client {
    constructor(options) {
        super(options);
        this.shutdown = () => {
            setTimeout(() => {
                process.exit(1);
            }, 1000 * 4);
            this.destroy().finally(() => process.exit());
        };
        this.ws = new LambertWebSocketManager_1.LambertWebSocketManager(this);
        this.server = new LambertServer_1.LambertServer(this, options.server);
        this.logger = new Logger_1.LoggerCollection(options.logger);
        this.eventLogger = new Logger_1.LambertDiscordClientEventLogger(this);
        if (!this.options.db)
            this.db = new MongodbProvider_1.MongoDatabase();
        else
            this.db = this.options.db;
        this.dbSync = new SyncDatabase_1.SyncDatabase(this);
        process.on("SIGINT", this.shutdown);
        global.client = this;
    }
    get data() {
        return Provider_1.Datastore(this);
    }
    init() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            this.emit(Events.DEBUG, "intializing Lambert client");
            yield Promise.all([
                this.db.init(),
                this.dbSync.init(),
                this.server.init(),
                this.eventLogger.init(),
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
            this.emit(Events.CLIENT_INIT);
        });
    }
    login(token) {
        const _super = Object.create(null, {
            login: { get: () => super.login }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield this.init();
            return _super.login.call(this, token);
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
            this.ws.destroy(keepalive);
            _super.destroy.call(this);
            return Promise.all([
                this.db.destroy(),
                this.dbSync.destroy(),
                this.server.destroy(),
                this.eventLogger.destroy(),
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
There was a critical exception, however Lambert catched it.
Please catch this error the next time:\n${error.stack}
`;
    if (global.client)
        global.client.logger.fatal(text);
    else
        console.error(text);
}
//# sourceMappingURL=LambertDiscordClient.js.map