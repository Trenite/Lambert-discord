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
exports.LambertMessage = void 0;
const discord_js_1 = require("discord.js");
class LambertMessage {
    ack(options, content, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.acknowledged)
                throw new Error("Already acknowledged message");
            this.acknowledged = true;
            if (content && msg) {
                return this.reply(content, msg);
            }
            return;
        });
    }
}
exports.LambertMessage = LambertMessage;
discord_js_1.Message.prototype.ack = LambertMessage.prototype.ack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGFtYmVydE1lc3NhZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3RydWN0dXJlcy9MYW1iZXJ0TWVzc2FnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSwyQ0FBdUU7QUFnQnZFLE1BQWEsY0FBYztJQUdwQixHQUFHLENBQUMsT0FBb0IsRUFBRSxPQUEwQixFQUFFLEdBQW9COztZQUMvRSxJQUFJLElBQUksQ0FBQyxZQUFZO2dCQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsOEJBQThCLENBQUMsQ0FBQztZQUN2RSxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztZQUN6QixJQUFJLE9BQU8sSUFBSSxHQUFHLEVBQUU7Z0JBQ25CLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUM7YUFDaEM7WUFDRCxPQUFPO1FBQ1IsQ0FBQztLQUFBO0NBQ0Q7QUFYRCx3Q0FXQztBQUVELG9CQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsR0FBRyxjQUFjLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyJ9