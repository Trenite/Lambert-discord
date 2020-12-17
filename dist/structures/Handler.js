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
    constructor(id) {
        super({ id });
        this.modules = new discord_js_1.Collection();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(this.modules.map((x) => x.init()));
        });
    }
    loadAll(dir) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!dir.endsWith("/"))
                dir += "/";
            let filesDirs = yield promises_1.default.readdir(dir, { withFileTypes: true });
            yield Promise.all(filesDirs.map((file) => __awaiter(this, void 0, void 0, function* () {
                try {
                    let path = dir + file.name;
                    let stat = yield promises_1.default.lstat(path);
                    if (stat.isDirectory()) {
                        // automatically make a category
                        let mod = new Handler(file.name);
                        yield mod.loadAll(path);
                        return this.register(mod);
                    }
                    if (!stat.isFile() || !path.endsWith(".js"))
                        return;
                    let mod = this.load(path);
                    return this.register(mod);
                }
                catch (error) { }
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
        let mod = new exportedClass();
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
        });
    }
    reload(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const mod = this.modules.get(id);
            if (!mod)
                throw new Error("Module not found");
            let handler = mod;
            if (!mod.filepath) {
                if (handler && handler.modules) {
                    yield Promise.all(handler.modules.map((x) => handler.reload(x.id)));
                    return;
                }
                else
                    throw new Error("Module not reloadable");
            }
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
            yield Promise.all(this.modules.keyArray().map(this.remove));
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
//# sourceMappingURL=Handler.js.map