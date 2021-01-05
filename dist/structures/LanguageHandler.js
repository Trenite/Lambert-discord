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
exports.LanguageHandler = void 0;
const i18next_1 = __importDefault(require("i18next"));
const Handler_1 = require("./Handler");
class LanguageHandler extends Handler_1.Handler {
    constructor(opts) {
        super({ id: "languages" });
        this.localization = i18next_1.default.createInstance(opts);
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.localization.init();
        });
    }
}
exports.LanguageHandler = LanguageHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGFuZ3VhZ2VIYW5kbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3N0cnVjdHVyZXMvTGFuZ3VhZ2VIYW5kbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHNEQUFxRDtBQUNyRCx1Q0FBb0M7QUFLcEMsTUFBYSxlQUFnQixTQUFRLGlCQUF1QjtJQUUzRCxZQUFZLElBQTRCO1FBQ3ZDLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxXQUFXLEVBQUUsQ0FBQyxDQUFDO1FBRTNCLElBQUksQ0FBQyxZQUFZLEdBQUcsaUJBQU8sQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUVLLElBQUk7O1lBQ1QsTUFBTSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2hDLENBQUM7S0FBQTtDQUdEO0FBYkQsMENBYUMifQ==