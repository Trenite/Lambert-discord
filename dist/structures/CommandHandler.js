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
exports.CommandHandler = void 0;
const Handler_1 = require("./Handler");
const discord_js_1 = require("discord.js");
class CommandHandler extends Handler_1.Handler {
    constructor(opts) {
        super({ id: "commands" });
        this.categories = new discord_js_1.Collection();
        if (opts.slashCommands == undefined)
            opts.slashCommands = true;
        this.options = opts;
        this.registry = opts.registry;
        this.client = this.registry.client;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.options.slashCommands) {
                const { application_id } = this.client.options;
                this.slashCommands = yield this.client.api
                    .applications(application_id)
                    .guilds("683026970606567440")
                    .commands.get();
            }
            setTimeout(() => {
                // TODO: after all commands were loaded check if commands were removed since the last start
            }, 1000 * 60);
        });
    }
    register(mod) {
        const _super = Object.create(null, {
            register: { get: () => super.register }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.initalized;
            yield _super.register.call(this, mod);
            const category = this.categories.get(mod.categoryId) || [];
            this.categories.set(mod.categoryId, category);
            category.push(mod);
            mod.category = category;
            mod.client = this.client;
            let exists = Object.assign({}, this.slashCommands.find((x) => x.name === mod.id));
            mod.slashId = exists.id;
            delete exists.application_id;
            delete exists.id;
            const data = mod.toSlashCommand();
            if (JSON.stringify(exists) !== JSON.stringify(data)) {
                const { application_id } = this.client.options;
                const { id } = yield this.client.api
                    .applications(application_id)
                    .guilds("683026970606567440")
                    .commands.post({ data });
                // TODO test if it really returns id
                mod.slashId = id;
            }
            return mod;
        });
    }
    remove(id) {
        const _super = Object.create(null, {
            remove: { get: () => super.remove }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const mod = this.modules.get(id);
            if (!mod)
                throw new Error("Module not found");
            const category = this.categories.get(mod.categoryId) || [];
            category.remove(mod);
            if (category.length === 0) {
                this.categories.delete(mod.categoryId);
            }
            return _super.remove.call(this, id);
        });
    }
}
exports.CommandHandler = CommandHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tbWFuZEhhbmRsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3RydWN0dXJlcy9Db21tYW5kSGFuZGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFDQSx1Q0FBb0M7QUFDcEMsMkNBQXdDO0FBVXhDLE1BQWEsY0FBZSxTQUFRLGlCQUFnQjtJQU9uRCxZQUFZLElBQTJCO1FBQ3RDLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDO1FBUFgsZUFBVSxHQUFrQyxJQUFJLHVCQUFVLEVBQUUsQ0FBQztRQVE1RSxJQUFJLElBQUksQ0FBQyxhQUFhLElBQUksU0FBUztZQUFFLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1FBRS9ELElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUM5QixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO0lBQ3BDLENBQUM7SUFFSyxJQUFJOztZQUNULElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUU7Z0JBQy9CLE1BQU0sRUFBRSxjQUFjLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQztnQkFDL0MsSUFBSSxDQUFDLGFBQWEsR0FBRyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRztxQkFDeEMsWUFBWSxDQUFDLGNBQWMsQ0FBQztxQkFDNUIsTUFBTSxDQUFDLG9CQUFvQixDQUFDO3FCQUM1QixRQUFRLENBQUMsR0FBRyxFQUFFLENBQUM7YUFDakI7WUFFRCxVQUFVLENBQUMsR0FBRyxFQUFFO2dCQUNmLDJGQUEyRjtZQUM1RixDQUFDLEVBQUUsSUFBSSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ2YsQ0FBQztLQUFBO0lBRUssUUFBUSxDQUFDLEdBQVk7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