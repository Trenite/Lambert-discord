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
exports.transformSend = exports.LambertTextBasedChannel = void 0;
const discord_js_1 = require("discord.js");
class LambertTextBasedChannel {
    send(oldSend, content, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const transformed = yield transformSend.call(this, content, options);
            return oldSend.call(this, null, transformed);
        });
    }
    awaitMessages(oldAwaitMessages, filter, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!options)
                options = {};
            if (!options.errors)
                options.errors = ["time"];
            if (!options.time)
                options.time = 30000;
            if (!options.max)
                options.max = 1;
            const result = yield oldAwaitMessages.call(this, filter, options);
            if (options.max === 1) {
                return result.first();
            }
            return result;
        });
    }
}
exports.LambertTextBasedChannel = LambertTextBasedChannel;
function transformSend(content, options) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!options && typeof content === "object" && !Array.isArray(content)) {
            options = content;
            content = undefined;
        }
        const opts = discord_js_1.APIMessage.transformOptions(content, options, {}, false);
        const { registry } = this.client;
        return yield registry.transformMessage(opts);
    });
}
exports.transformSend = transformSend;
const oldTextChannelSend = discord_js_1.TextChannel.prototype.send;
// @ts-ignore
discord_js_1.TextChannel.prototype.send = function (content, options) {
    LambertTextBasedChannel.prototype.send.call(this, oldTextChannelSend, content, options);
};
const oldTextChannelAwaitMessages = discord_js_1.TextChannel.prototype.awaitMessages;
// @ts-ignore
discord_js_1.TextChannel.prototype.awaitMessages = function (content, options) {
    LambertTextBasedChannel.prototype.awaitMessages.call(this, oldTextChannelAwaitMessages, content, options);
};
const oldDMChannelSend = discord_js_1.DMChannel.prototype.send;
// @ts-ignore
discord_js_1.DMChannel.prototype.send = function (content, options) {
    LambertTextBasedChannel.prototype.send.call(this, oldDMChannelSend, content, options);
};
const oldDMChannelAwaitMessages = discord_js_1.DMChannel.prototype.awaitMessages;
// @ts-ignore
discord_js_1.DMChannel.prototype.awaitMessages = function (content, options) {
    LambertTextBasedChannel.prototype.awaitMessages.call(this, oldDMChannelAwaitMessages, content, options);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGFtYmVydFRleHRCYXNlZENoYW5uZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3RydWN0dXJlcy9MYW1iZXJ0VGV4dEJhc2VkQ2hhbm5lbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSwyQ0FVb0I7QUFNcEIsTUFBYSx1QkFBdUI7SUFDN0IsSUFBSSxDQUFDLE9BQVksRUFBRSxPQUF5QixFQUFFLE9BQXVCOztZQUMxRSxNQUFNLFdBQVcsR0FBRyxNQUFNLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztZQUNyRSxPQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxXQUFXLENBQUMsQ0FBQztRQUM5QyxDQUFDO0tBQUE7SUFFSyxhQUFhLENBQUMsZ0JBQXFCLEVBQUUsTUFBdUIsRUFBRSxPQUE4Qjs7WUFDakcsSUFBSSxDQUFDLE9BQU87Z0JBQUUsT0FBTyxHQUFHLEVBQUUsQ0FBQztZQUMzQixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU07Z0JBQUUsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQy9DLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSTtnQkFBRSxPQUFPLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztZQUN4QyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUc7Z0JBQUUsT0FBTyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFFbEMsTUFBTSxNQUFNLEdBQWdDLE1BQU0sZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFFL0YsSUFBSSxPQUFPLENBQUMsR0FBRyxLQUFLLENBQUMsRUFBRTtnQkFDdEIsT0FBTyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7YUFDdEI7WUFFRCxPQUFPLE1BQU0sQ0FBQztRQUNmLENBQUM7S0FBQTtDQUNEO0FBcEJELDBEQW9CQztBQUVELFNBQXNCLGFBQWEsQ0FBQyxPQUF5QixFQUFFLE9BQXVCOztRQUNyRixJQUFJLENBQUMsT0FBTyxJQUFJLE9BQU8sT0FBTyxLQUFLLFFBQVEsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDdkUsT0FBTyxHQUFHLE9BQU8sQ0FBQztZQUNsQixPQUFPLEdBQUcsU0FBUyxDQUFDO1NBQ3BCO1FBRUQsTUFBTSxJQUFJLEdBQW1CLHVCQUFVLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDdEYsTUFBTSxFQUFFLFFBQVEsRUFBRSxHQUF5QixJQUFJLENBQUMsTUFBTSxDQUFDO1FBRXZELE9BQU8sTUFBTSxRQUFRLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDOUMsQ0FBQztDQUFBO0FBVkQsc0NBVUM7QUFFRCxNQUFNLGtCQUFrQixHQUFHLHdCQUFXLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztBQUN0RCxhQUFhO0FBQ2Isd0JBQVcsQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLFVBQVUsT0FBWSxFQUFFLE9BQVk7SUFDaEUsdUJBQXVCLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLGtCQUFrQixFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztBQUN6RixDQUFDLENBQUM7QUFFRixNQUFNLDJCQUEyQixHQUFHLHdCQUFXLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQztBQUN4RSxhQUFhO0FBQ2Isd0JBQVcsQ0FBQyxTQUFTLENBQUMsYUFBYSxHQUFHLFVBQVUsT0FBWSxFQUFFLE9BQVk7SUFDekUsdUJBQXVCLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLDJCQUEyQixFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztBQUMzRyxDQUFDLENBQUM7QUFFRixNQUFNLGdCQUFnQixHQUFHLHNCQUFTLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztBQUNsRCxhQUFhO0FBQ2Isc0JBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLFVBQVUsT0FBWSxFQUFFLE9BQVk7SUFDOUQsdUJBQXVCLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLGdCQUFnQixFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztBQUN2RixDQUFDLENBQUM7QUFFRixNQUFNLHlCQUF5QixHQUFHLHNCQUFTLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQztBQUNwRSxhQUFhO0FBQ2Isc0JBQVMsQ0FBQyxTQUFTLENBQUMsYUFBYSxHQUFHLFVBQVUsT0FBWSxFQUFFLE9BQVk7SUFDdkUsdUJBQXVCLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLHlCQUF5QixFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztBQUN6RyxDQUFDLENBQUMifQ==