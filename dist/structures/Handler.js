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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Handler = exports.HandlerEvents = void 0;
const discord_js_1 = require("discord.js");
const promises_1 = __importDefault(require("fs/promises"));
const Module_1 = require("./Module");
exports.HandlerEvents = {
    LOAD: "load",
    LOADALL: "loadAll",
    REGISTER: "register",
    RELOAD: "reload",
    RELOADALL: "reloadAll",
    REMOVE: "remove",
    REMOVEALL: "removeAll",
    ERROR: "error",
};
class Handler extends Module_1.Module {
    constructor({ id, json }) {
        super({ id });
        this.modules = new discord_js_1.Collection();
        this.loadJson = json;
    }
    loadAll(dir) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!dir.endsWith("/"))
                dir += "/";
            let filesDirs = yield promises_1.default.readdir(dir, { withFileTypes: true });
            yield Promise.all(filesDirs.map((file) => __awaiter(this, void 0, void 0, function* () {
                let path = dir + file.name;
                try {
                    let stat = yield promises_1.default.lstat(path);
                    if (stat.isDirectory()) {
                        return yield this.loadAll(path);
                    }
                    const fileTypes = ["js"];
                    const extension = path.split(".").last();
                    if (this.loadJson)
                        fileTypes.push("json");
                    if (!stat.isFile() || !fileTypes.includes(extension))
                        return;
                    let mod = this.load(path);
                    return this.register(mod);
                }
                catch (error) {
                    console.error("error loading file: " + path, error);
                }
            })));
        });
    }
    load(path) {
        let file = require(path);
        if (file.default)
            file = file.default;
        else {
            let k = Object.keys(file);
            if (k.length)
                file = file[k.first()];
        }
        let exportedClass = file;
        var mod;
        if (isClass(exportedClass))
            mod = new exportedClass(this);
        else
            mod = exportedClass;
        if (!mod.id)
            mod.id = path;
        mod.filepath = path;
        this.emit(exports.HandlerEvents.LOAD, path);
        return mod;
    }
    register(mod) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mod)
                throw new Error("Module must not be undefined");
            if (!(mod instanceof Module_1.Module))
                throw new Error("Class must extend Module");
            if (this.modules.get(mod.id))
                throw new Error("Module already exists: " + mod.id);
            mod.handler = this;
            yield mod.init();
            this.modules.set(mod.id, mod);
            this.emit(exports.HandlerEvents.REGISTER, mod);
            return mod;
        });
    }
    reload(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const mod = this.modules.get(id);
            if (!mod)
                throw new Error("Module not found");
            yield this.remove(id);
            yield this.register(this.load(mod.filepath));
            this.emit(exports.HandlerEvents.RELOAD, id);
        });
    }
    getModule(id) {
        return (super.getModule(id) ||
            this.modules.find((x) => {
                if (!x || !x.getModule)
                    return;
                return x.getModule(id);
            }));
    }
    reloadAll() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all(this.modules.keyArray().map(this.reload));
            this.emit(exports.HandlerEvents.RELOADALL);
        });
    }
    remove(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const mod = this.modules.get(id);
            if (!mod)
                throw new Error("Module not found");
            if (mod.filepath) {
                const filepath = require.resolve(mod.filepath);
                if (filepath)
                    delete require.cache[filepath];
            }
            yield mod.destroy();
            this.modules.delete(id);
            this.emit(exports.HandlerEvents.REMOVE, id);
        });
    }
    removeAll() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all(this.modules.keyArray().map((x) => this.remove(x)));
            this.emit(exports.HandlerEvents.REMOVEALL);
        });
    }
    destroy() {
        const _super = Object.create(null, {
            destroy: { get: () => super.destroy }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.destroy.call(this);
            yield this.removeAll();
        });
    }
}
exports.Handler = Handler;
function isClass(obj) {
    const isCtorClass = obj.constructor && obj.constructor.toString().substring(0, 5) === "class";
    if (obj.prototype === undefined) {
        return isCtorClass;
    }
    const isPrototypeCtorClass = obj.prototype.constructor &&
        obj.prototype.constructor.toString &&
        obj.prototype.constructor.toString().substring(0, 5) === "class";
    return isCtorClass || isPrototypeCtorClass;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGFuZGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdHJ1Y3R1cmVzL0hhbmRsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsMkNBQXdDO0FBQ3hDLDJEQUE2QjtBQUU3QixxQ0FBa0M7QUFFckIsUUFBQSxhQUFhLEdBQUc7SUFDNUIsSUFBSSxFQUFFLE1BQU07SUFDWixPQUFPLEVBQUUsU0FBUztJQUNsQixRQUFRLEVBQUUsVUFBVTtJQUNwQixNQUFNLEVBQUUsUUFBUTtJQUNoQixTQUFTLEVBQUUsV0FBVztJQUN0QixNQUFNLEVBQUUsUUFBUTtJQUNoQixTQUFTLEVBQUUsV0FBVztJQUN0QixLQUFLLEVBQUUsT0FBTztDQUNkLENBQUM7QUFJRixNQUFhLE9BQThCLFNBQVEsZUFBTTtJQUt4RCxZQUFZLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBa0I7UUFDdkMsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUpDLFlBQU8sR0FBOEIsSUFBSSx1QkFBVSxFQUFFLENBQUM7UUFLckUsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7SUFDdEIsQ0FBQztJQUVLLE9BQU8sQ0FBQyxHQUFXOztZQUN4QixJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUM7Z0JBQUUsR0FBRyxJQUFJLEdBQUcsQ0FBQztZQUVuQyxJQUFJLFNBQVMsR0FBRyxNQUFNLGtCQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLGFBQWEsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBRS9ELE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FDaEIsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFPLElBQUksRUFBRSxFQUFFO2dCQUM1QixJQUFJLElBQUksR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztnQkFDM0IsSUFBSTtvQkFDSCxJQUFJLElBQUksR0FBRyxNQUFNLGtCQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNoQyxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUUsRUFBRTt3QkFDdkIsT0FBTyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7cUJBQ2hDO29CQUNELE1BQU0sU0FBUyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ3pCLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBRXpDLElBQUksSUFBSSxDQUFDLFFBQVE7d0JBQUUsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDMUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDO3dCQUFFLE9BQU87b0JBRTdELElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQzFCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztpQkFDMUI7Z0JBQUMsT0FBTyxLQUFLLEVBQUU7b0JBQ2YsT0FBTyxDQUFDLEtBQUssQ0FBQyxzQkFBc0IsR0FBRyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7aUJBQ3BEO1lBQ0YsQ0FBQyxDQUFBLENBQUMsQ0FDRixDQUFDO1FBQ0gsQ0FBQztLQUFBO0lBRUQsSUFBSSxDQUFDLElBQVk7UUFDaEIsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3pCLElBQUksSUFBSSxDQUFDLE9BQU87WUFBRSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQzthQUNqQztZQUNKLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDMUIsSUFBSSxDQUFDLENBQUMsTUFBTTtnQkFBRSxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1NBQ3JDO1FBQ0QsSUFBSSxhQUFhLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLElBQUksR0FBVSxDQUFDO1FBRWYsSUFBSSxPQUFPLENBQUMsYUFBYSxDQUFDO1lBQUUsR0FBRyxHQUFHLElBQUksYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDOztZQUNyRCxHQUFHLEdBQUcsYUFBYSxDQUFDO1FBRXpCLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUFFLEdBQUcsQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQzNCLEdBQUcsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBRXBCLElBQUksQ0FBQyxJQUFJLENBQUMscUJBQWEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDcEMsT0FBTyxHQUFHLENBQUM7SUFDWixDQUFDO0lBRUssUUFBUSxDQUFDLEdBQVU7O1lBQ3hCLElBQUksQ0FBQyxHQUFHO2dCQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsOEJBQThCLENBQUMsQ0FBQztZQUMxRCxJQUFJLENBQUMsQ0FBQyxHQUFHLFlBQVksZUFBTSxDQUFDO2dCQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsMEJBQTBCLENBQUMsQ0FBQztZQUMxRSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7Z0JBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyx5QkFBeUIsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDbEYsR0FBRyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7WUFFbkIsTUFBTSxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDakIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUM5QixJQUFJLENBQUMsSUFBSSxDQUFDLHFCQUFhLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ3ZDLE9BQU8sR0FBRyxDQUFDO1FBQ1osQ0FBQztLQUFBO0lBRUssTUFBTSxDQUFDLEVBQVU7O1lBQ3RCLE1BQU0sR0FBRyxHQUFVLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3hDLElBQUksQ0FBQyxHQUFHO2dCQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsa0JBQWtCLENBQUMsQ0FBQztZQUU5QyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDdEIsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDN0MsSUFBSSxDQUFDLElBQUksQ0FBQyxxQkFBYSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNyQyxDQUFDO0tBQUE7SUFFRCxTQUFTLENBQUMsRUFBVTtRQUNuQixPQUFPLENBQ0MsS0FBSyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUM7WUFDMUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtnQkFDdkIsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTO29CQUFFLE9BQU87Z0JBQy9CLE9BQTBCLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFFLENBQUM7WUFDNUMsQ0FBQyxDQUFDLENBQ0YsQ0FBQztJQUNILENBQUM7SUFFSyxTQUFTOztZQUNkLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUM1RCxJQUFJLENBQUMsSUFBSSxDQUFDLHFCQUFhLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDcEMsQ0FBQztLQUFBO0lBRUssTUFBTSxDQUFDLEVBQVU7O1lBQ3RCLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2pDLElBQUksQ0FBQyxHQUFHO2dCQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsa0JBQWtCLENBQUMsQ0FBQztZQUU5QyxJQUFJLEdBQUcsQ0FBQyxRQUFRLEVBQUU7Z0JBQ2pCLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUMvQyxJQUFJLFFBQVE7b0JBQUUsT0FBTyxPQUFPLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQzdDO1lBRUQsTUFBTSxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDcEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDeEIsSUFBSSxDQUFDLElBQUksQ0FBQyxxQkFBYSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNyQyxDQUFDO0tBQUE7SUFFSyxTQUFTOztZQUNkLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdEUsSUFBSSxDQUFDLElBQUksQ0FBQyxxQkFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3BDLENBQUM7S0FBQTtJQUVLLE9BQU87Ozs7O1lBQ1osTUFBTSxPQUFNLE9BQU8sV0FBRSxDQUFDO1lBQ3RCLE1BQU0sSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ3hCLENBQUM7S0FBQTtDQUNEO0FBckhELDBCQXFIQztBQUVELFNBQVMsT0FBTyxDQUFDLEdBQVE7SUFDeEIsTUFBTSxXQUFXLEdBQUcsR0FBRyxDQUFDLFdBQVcsSUFBSSxHQUFHLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssT0FBTyxDQUFDO0lBQzlGLElBQUksR0FBRyxDQUFDLFNBQVMsS0FBSyxTQUFTLEVBQUU7UUFDaEMsT0FBTyxXQUFXLENBQUM7S0FDbkI7SUFDRCxNQUFNLG9CQUFvQixHQUN6QixHQUFHLENBQUMsU0FBUyxDQUFDLFdBQVc7UUFDekIsR0FBRyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsUUFBUTtRQUNsQyxHQUFHLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLE9BQU8sQ0FBQztJQUNsRSxPQUFPLFdBQVcsSUFBSSxvQkFBb0IsQ0FBQztBQUM1QyxDQUFDIn0=