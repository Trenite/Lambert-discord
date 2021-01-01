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
const Handler_1 = require("./Handler");
require("missing-native-js-functions");
class InhibitorHandler extends Handler_1.Handler {
    constructor(emitter) {
        super({ id: emitter.constructor.name });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW5oaWJpdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3N0cnVjdHVyZXMvSW5oaWJpdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLDJDQUF3QztBQUV4Qyx1Q0FBb0M7QUFFcEMsdUNBQXFDO0FBRXJDLE1BQWEsZ0JBQWlCLFNBQVEsaUJBQWtCO0lBSXZELFlBQTRCLE9BQXFCO1FBQ2hELEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxPQUFPLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7UUFEYixZQUFPLEdBQVAsT0FBTyxDQUFjO1FBSGpDLFlBQU8sR0FBcUQsSUFBSSx1QkFBVSxFQUFFLENBQUM7UUFNNUYsSUFBSSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDckMsYUFBYTtRQUNiLE9BQU8sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUM1QixDQUFDO0lBRUssTUFBTSxDQUFDLEtBQWEsRUFBRSxHQUFHLElBQVc7O1lBQ3pDLElBQUksTUFBZSxDQUFDO1lBRXBCLElBQUk7Z0JBQ0gsTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQzthQUN6QztZQUFDLE9BQU8sS0FBSyxFQUFFO2dCQUNmLE1BQU0sR0FBRyxLQUFLLENBQUM7YUFDZjtZQUVELElBQUksTUFBTTtnQkFBRSxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7WUFDdkUsT0FBTyxLQUFLLENBQUM7UUFDZCxDQUFDO0tBQUE7SUFFSyxJQUFJLENBQUMsS0FBYSxFQUFFLEdBQUcsSUFBVzs7WUFDdkMsSUFBSSxRQUFRLEdBQUcsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsRyxPQUFPLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuQyxDQUFDO0tBQUE7Q0FDRDtBQTlCRCw0Q0E4QkMifQ==