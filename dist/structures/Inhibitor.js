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
exports.InhibitorHandler = void 0;
const discord_js_1 = require("discord.js");
const JavaScript_1 = require("../util/JavaScript");
const Handler_1 = require("./Handler");
JavaScript_1.init();
class InhibitorHandler extends Handler_1.Handler {
    constructor(emitter) {
        super(emitter.constructor.name);
        this.emitter = emitter;
        this.modules = new discord_js_1.Collection();
        this.passthrough = emitter.emit;
        this.onEmit = this.onEmit.bind(this);
        // @ts-ignore
        emitter.emit = this.onEmit;
    }
    onEmit(event, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            try {
                result = yield this.test(event, ...args);
            }
            catch (error) {
                result = false;
            }
            if (result)
                return this.passthrough.call(this.emitter, event, ...args);
            return false;
        });
    }
    test(event, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            let promises = yield Promise.all(this.modules.map((inhibitor) => inhibitor.test(event, ...args)));
            return promises.every((x) => !!x);
        });
    }
}
exports.InhibitorHandler = InhibitorHandler;
//# sourceMappingURL=Inhibitor.js.map