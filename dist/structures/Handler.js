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
    constructor({ id }) {
        super({ id });
        this.modules = new discord_js_1.Collection();
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
                    if (!stat.isFile() || !path.endsWith(".js"))
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGFuZGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdHJ1Y3R1cmVzL0hhbmRsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsMkNBQXdDO0FBQ3hDLDJEQUE2QjtBQUU3QixxQ0FBa0M7QUFFckIsUUFBQSxhQUFhLEdBQUc7SUFDNUIsSUFBSSxFQUFFLE1BQU07SUFDWixPQUFPLEVBQUUsU0FBUztJQUNsQixRQUFRLEVBQUUsVUFBVTtJQUNwQixNQUFNLEVBQUUsUUFBUTtJQUNoQixTQUFTLEVBQUUsV0FBVztJQUN0QixNQUFNLEVBQUUsUUFBUTtJQUNoQixTQUFTLEVBQUUsV0FBVztJQUN0QixLQUFLLEVBQUUsT0FBTztDQUNkLENBQUM7QUFJRixNQUFhLE9BQThCLFNBQVEsZUFBTTtJQUl4RCxZQUFZLEVBQUUsRUFBRSxFQUFrQjtRQUNqQyxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBSEMsWUFBTyxHQUE4QixJQUFJLHVCQUFVLEVBQUUsQ0FBQztJQUl0RSxDQUFDO0lBRUssT0FBTyxDQUFDLEdBQVc7O1lBQ3hCLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQztnQkFBRSxHQUFHLElBQUksR0FBRyxDQUFDO1lBRW5DLElBQUksU0FBUyxHQUFHLE1BQU0sa0JBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsYUFBYSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7WUFFL0QsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUNoQixTQUFTLENBQUMsR0FBRyxDQUFDLENBQU8sSUFBSSxFQUFFLEVBQUU7Z0JBQzVCLElBQUksSUFBSSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUMzQixJQUFJO29CQUNILElBQUksSUFBSSxHQUFHLE1BQU0sa0JBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ2hD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