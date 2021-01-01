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
const util_1 = require("util");
const discord_js_1 = require("discord.js");
const lambert_db_1 = require("lambert-db");
class LambertGuild {
    _patch(data) {
        this.init();
        return oldPatch.call(this, data);
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this._prefix = this.data.prefix.__getProvider().cache;
            return this._prefix.init();
        });
    }
    get prefix() {
        return this._prefix.get() || this.client.options.commandPrefix;
    }
    get data() {
        return lambert_db_1.Datastore(this.client.db, [{ name: "guilds", filter: { id: this.id } }, { name: "data" }]);
    }
    destroy() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._prefix.destroy();
        });
    }
}
exports.LambertGuild = LambertGuild;
const oldPatch = discord_js_1.Guild.prototype._patch;
discord_js_1.Guild.prototype._patch = LambertGuild.prototype._patch;
util_1.inherits(discord_js_1.Guild, discord_js_1.Base);
util_1.inherits(discord_js_1.Guild, LambertGuild);
// const guilds: any[] = await this.client.data.guilds({ shardID: this.client.options.shards }).get();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGFtYmVydEd1aWxkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3N0cnVjdHVyZXMvTGFtYmVydEd1aWxkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLCtCQUFnQztBQUNoQywyQ0FBeUM7QUFDekMsMkNBQXNEO0FBZ0J0RCxNQUFhLFlBQVk7SUFDeEIsTUFBTSxDQUFDLElBQVM7UUFDZixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDWixPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFFSyxJQUFJOztZQUNULElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUMsS0FBSyxDQUFDO1lBQ3RELE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUM1QixDQUFDO0tBQUE7SUFFRCxJQUFJLE1BQU07UUFDVCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDO0lBQ2hFLENBQUM7SUFFRCxJQUFXLElBQUk7UUFDZCxPQUFPLHNCQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNuRyxDQUFDO0lBRUssT0FBTzs7WUFDWixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDL0IsQ0FBQztLQUFBO0NBQ0Q7QUF0QkQsb0NBc0JDO0FBRUQsTUFBTSxRQUFRLEdBQUcsa0JBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDO0FBQ3hDLGtCQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxZQUFZLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUV2RCxlQUFRLENBQUMsa0JBQUssRUFBRSxpQkFBSSxDQUFDLENBQUM7QUFDdEIsZUFBUSxDQUFDLGtCQUFLLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFFOUIsc0dBQXNHIn0=