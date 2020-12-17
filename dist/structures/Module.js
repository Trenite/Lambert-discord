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
exports.Module = void 0;
const events_1 = require("events");
class Module extends events_1.EventEmitter {
    constructor(props) {
        super();
        this.intialized = false;
        this.id = props.id;
        this.filepath = props.filepath;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.intialized = true;
        });
    }
    getModule(id) {
        if (this.id.toLowerCase() === id.toLowerCase())
            return this;
    }
    destroy() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    reload(id) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            return (_a = this.handler) === null || _a === void 0 ? void 0 : _a.reload(this.id);
        });
    }
}
exports.Module = Module;
//# sourceMappingURL=Module.js.map