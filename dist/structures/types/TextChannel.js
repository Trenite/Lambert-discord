"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextChannelType = void 0;
const ArgumentType_1 = require("../ArgumentType");
const LambertError_1 = require("../LambertError");
const Channel_1 = require("./Channel");
const CHANNEL_PATTERN = /^(?:<#)?([0-9]+)>?$/;
class TextChannelType extends ArgumentType_1.ArgumentType {
    constructor() {
        super({ id: "textchannel" });
        this.slashType = 7;
    }
    parse({ val, cmd, trigger }) {
        val = val.toLowerCase();
        const mention = val.match(CHANNEL_PATTERN);
        let channel;
        if (mention)
            channel = trigger.guild.channels.resolve(mention[1]);
        else
            channel = Channel_1.getMostSimilarCache(val, trigger.guild.channels.cache.filter((x) => !!x.messages), (x) => x.name);
        if (!channel || !channel.messages)
            throw new LambertError_1.LambertError(LambertError_1.ERRORS.NOT_A_TEXTCHANNEL, val);
        return channel;
    }
}
exports.TextChannelType = TextChannelType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGV4dENoYW5uZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvc3RydWN0dXJlcy90eXBlcy9UZXh0Q2hhbm5lbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxrREFBK0M7QUFFL0Msa0RBQXVEO0FBQ3ZELHVDQUFnRDtBQUNoRCxNQUFNLGVBQWUsR0FBRyxxQkFBcUIsQ0FBQztBQUU5QyxNQUFhLGVBQWdCLFNBQVEsMkJBQVk7SUFDaEQ7UUFDQyxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsYUFBYSxFQUFFLENBQUMsQ0FBQztRQUM3QixJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztJQUNwQixDQUFDO0lBRUQsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQWdCO1FBQ3hDLEdBQUcsR0FBRyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDeEIsTUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUMzQyxJQUFJLE9BQW9CLENBQUM7UUFDekIsSUFBSSxPQUFPO1lBQUUsT0FBTyxHQUFnQixPQUFPLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7O1lBRTlFLE9BQU8sR0FBRyw2QkFBbUIsQ0FDNUIsR0FBRyxFQUNILE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBZSxDQUFFLENBQUMsUUFBUSxDQUFDLEVBQ3ZFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUNiLENBQUM7UUFFSCxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVE7WUFBRSxNQUFNLElBQUksMkJBQVksQ0FBQyxxQkFBTSxDQUFDLGlCQUFpQixFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3pGLE9BQU8sT0FBTyxDQUFDO0lBQ2hCLENBQUM7Q0FDRDtBQXJCRCwwQ0FxQkMifQ==