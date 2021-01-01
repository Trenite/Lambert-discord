"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryChannelType = void 0;
const ArgumentType_1 = require("../ArgumentType");
const LambertError_1 = require("../LambertError");
const Channel_1 = require("./Channel");
const CHANNEL_PATTERN = /^(?:<#)?([0-9]+)>?$/;
class CategoryChannelType extends ArgumentType_1.ArgumentType {
    constructor() {
        super({ id: "categorychannel" });
        this.slashType = 7;
    }
    parse({ val, cmd, trigger }) {
        val = val.toLowerCase();
        const mention = val.match(CHANNEL_PATTERN);
        let channel;
        if (mention)
            channel = trigger.guild.channels.resolve(mention[1]);
        else
            channel = Channel_1.getMostSimilarCache(val, trigger.guild.channels.cache.filter((x) => x.type === "category"), (x) => x.name);
        if (!channel || channel.type !== "category")
            throw new LambertError_1.LambertError(LambertError_1.ERRORS.NOT_A_CATEGORYCHANNEL, val);
        return channel;
    }
}
exports.CategoryChannelType = CategoryChannelType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2F0ZWdvcnlDaGFubmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3N0cnVjdHVyZXMvdHlwZXMvQ2F0ZWdvcnlDaGFubmVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLGtEQUErQztBQUUvQyxrREFBdUQ7QUFDdkQsdUNBQWdEO0FBRWhELE1BQU0sZUFBZSxHQUFHLHFCQUFxQixDQUFDO0FBRTlDLE1BQWEsbUJBQW9CLFNBQVEsMkJBQVk7SUFDcEQ7UUFDQyxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0lBQ3BCLENBQUM7SUFFRCxLQUFLLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBZ0I7UUFDeEMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUN4QixNQUFNLE9BQU8sR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBRTNDLElBQUksT0FBd0IsQ0FBQztRQUM3QixJQUFJLE9BQU87WUFBRSxPQUFPLEdBQW9CLE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7WUFFbEYsT0FBTyxHQUFHLDZCQUFtQixDQUM1QixHQUFHLEVBQ0gsT0FBTyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQW1CLENBQUUsQ0FBQyxJQUFJLEtBQUssVUFBVSxDQUFDLEVBQ3BGLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUNiLENBQUM7UUFFSCxJQUFJLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxJQUFJLEtBQUssVUFBVTtZQUFFLE1BQU0sSUFBSSwyQkFBWSxDQUFDLHFCQUFNLENBQUMscUJBQXFCLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDdkcsT0FBTyxPQUFPLENBQUM7SUFDaEIsQ0FBQztDQUNEO0FBdEJELGtEQXNCQyJ9