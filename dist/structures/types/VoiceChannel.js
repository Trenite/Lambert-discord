"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceChannelType = void 0;
const ArgumentType_1 = require("../ArgumentType");
const LambertError_1 = require("../LambertError");
const Channel_1 = require("./Channel");
const CHANNEL_PATTERN = /^(?:<#)?([0-9]+)>?$/;
class VoiceChannelType extends ArgumentType_1.ArgumentType {
    constructor() {
        super({ id: "voicechannel" });
        this.slashType = 7;
    }
    parse({ val, cmd, trigger }) {
        val = val.toLowerCase();
        const mention = val.match(CHANNEL_PATTERN);
        let channel;
        if (mention)
            channel = trigger.guild.channels.resolve(mention[1]);
        else
            channel = Channel_1.getMostSimilarCache(val, trigger.guild.channels.cache.filter((x) => !!x.join), (x) => x.name);
        if (!channel || !channel.join)
            throw new LambertError_1.LambertError(LambertError_1.ERRORS.NOT_A_VOICECHANNEL, val);
        return channel;
    }
}
exports.VoiceChannelType = VoiceChannelType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVm9pY2VDaGFubmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3N0cnVjdHVyZXMvdHlwZXMvVm9pY2VDaGFubmVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLGtEQUErQztBQUUvQyxrREFBdUQ7QUFDdkQsdUNBQWdEO0FBQ2hELE1BQU0sZUFBZSxHQUFHLHFCQUFxQixDQUFDO0FBRTlDLE1BQWEsZ0JBQWlCLFNBQVEsMkJBQVk7SUFDakQ7UUFDQyxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsY0FBYyxFQUFFLENBQUMsQ0FBQztRQUM5QixJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztJQUNwQixDQUFDO0lBRUQsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQWdCO1FBQ3hDLEdBQUcsR0FBRyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDeEIsTUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUMzQyxJQUFJLE9BQXFCLENBQUM7UUFDMUIsSUFBSSxPQUFPO1lBQUUsT0FBTyxHQUFpQixPQUFPLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7O1lBRS9FLE9BQU8sR0FBRyw2QkFBbUIsQ0FDNUIsR0FBRyxFQUNILE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBZ0IsQ0FBRSxDQUFDLElBQUksQ0FBQyxFQUNwRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FDYixDQUFDO1FBRUgsSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJO1lBQUUsTUFBTSxJQUFJLDJCQUFZLENBQUMscUJBQU0sQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUN0RixPQUFPLE9BQU8sQ0FBQztJQUNoQixDQUFDO0NBQ0Q7QUFyQkQsNENBcUJDIn0=