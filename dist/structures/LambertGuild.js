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
exports.LambertGuild = void 0;
const discord_js_1 = require("discord.js");
const Provider_1 = require("./Provider");
class LambertGuild extends discord_js_1.Guild {
    constructor(client, data) {
        super(client, data);
        this.client = client;
        this._prefix = this.data.prefix.__getProvider().cache;
        // console.log("got guild", data);
        this.init();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._prefix.init();
        });
    }
    get prefix() {
        return this._prefix.get() || this.client.options.commandPrefix;
    }
    get data() {
        return Provider_1.Datastore(this.client, [{ name: "guilds", filter: { id: this.id } }, { name: "data" }]);
    }
    destroy() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._prefix.destroy();
        });
    }
}
exports.LambertGuild = LambertGuild;
// const guilds: any[] = await this.client.data.guilds({ shardID: this.client.options.shards }).get();
discord_js_1.Structures.extend("Guild", (Guild) => {
    return LambertGuild;
});
//# sourceMappingURL=LambertGuild.js.map