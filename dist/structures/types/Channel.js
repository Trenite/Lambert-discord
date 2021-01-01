"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMostSimilarCache = exports.ChannelType = void 0;
const ArgumentType_1 = require("../ArgumentType");
const LambertError_1 = require("../LambertError");
const CHANNEL_PATTERN = /^(?:<#)?([0-9]+)>?$/;
class ChannelType extends ArgumentType_1.ArgumentType {
    constructor() {
        super({ id: "channel" });
        this.slashType = 7;
    }
    parse({ val, cmd, trigger }) {
        val = val.toLowerCase();
        const mention = val.match(CHANNEL_PATTERN);
        let channel;
        if (mention)
            channel = trigger.guild.channels.resolve(mention[1]);
        else
            channel = getMostSimilarCache(val, trigger.guild.channels.cache, (x) => x.name);
        if (!channel)
            throw new LambertError_1.LambertError(LambertError_1.ERRORS.NOT_A_CHANNEL, val);
        return channel;
    }
}
exports.ChannelType = ChannelType;
function getMostSimilarCache(val, cache, prop) {
    let entries = cache
        .map((x) => ({
        entry: x,
        // @ts-ignore
        rating: val.similarity(prop(x)),
    }))
        .sort((a, b) => b.rating - a.rating)
        .map((x) => x.entry);
    return entries.first();
}
exports.getMostSimilarCache = getMostSimilarCache;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2hhbm5lbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zdHJ1Y3R1cmVzL3R5cGVzL0NoYW5uZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0Esa0RBQStDO0FBRS9DLGtEQUF1RDtBQUN2RCxNQUFNLGVBQWUsR0FBRyxxQkFBcUIsQ0FBQztBQUU5QyxNQUFhLFdBQVksU0FBUSwyQkFBWTtJQUM1QztRQUNDLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0lBQ3BCLENBQUM7SUFFRCxLQUFLLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBZ0I7UUFDeEMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUN4QixNQUFNLE9BQU8sR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQzNDLElBQUksT0FBZ0IsQ0FBQztRQUNyQixJQUFJLE9BQU87WUFBRSxPQUFPLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOztZQUM3RCxPQUFPLEdBQUcsbUJBQW1CLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXJGLElBQUksQ0FBQyxPQUFPO1lBQUUsTUFBTSxJQUFJLDJCQUFZLENBQUMscUJBQU0sQ0FBQyxhQUFhLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDaEUsT0FBTyxPQUFPLENBQUM7SUFDaEIsQ0FBQztDQUNEO0FBaEJELGtDQWdCQztBQUVELFNBQWdCLG1CQUFtQixDQUFDLEdBQVcsRUFBRSxLQUE4QixFQUFFLElBQXdCO0lBQ3hHLElBQUksT0FBTyxHQUFHLEtBQUs7U0FDakIsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ1osS0FBSyxFQUFFLENBQUM7UUFDUixhQUFhO1FBQ2IsTUFBTSxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQy9CLENBQUMsQ0FBQztTQUNGLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQztTQUNuQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUV0QixPQUFPLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUN4QixDQUFDO0FBWEQsa0RBV0MifQ==