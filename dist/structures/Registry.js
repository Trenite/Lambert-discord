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
exports.Registry = void 0;
const Handler_1 = require("./Handler");
class Registry {
    constructor() {
        this.commands = new Handler_1.Handler("commands");
        this.inhibitors = new Handler_1.Handler("inhibitors");
        this.events = new Handler_1.Handler("events");
        this.types = new Handler_1.Handler("types");
        this.messageTransformer = (x) => x;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all([this.commands.destroy(), this.events.init(), this.types.init(), this.inhibitors.init()]);
        });
    }
    registerDefault() {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all([
                this.registerDefaultCommands(),
                this.registerDefaultTypes(),
                this.registerDefaultInhibitors(),
                this.registerDefaultEvents(),
                this.registerDefaultMessageTransformers(),
            ]);
        });
    }
    registerDefaultCommands() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    registerDefaultTypes() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    registerDefaultInhibitors() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    registerDefaultEvents() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    registerDefaultMessageTransformers() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    destroy() {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all([
                this.commands.destroy(),
                this.events.destroy(),
                this.types.destroy(),
                this.inhibitors.destroy(),
            ]);
        });
    }
}
exports.Registry = Registry;
//# sourceMappingURL=Registry.js.map