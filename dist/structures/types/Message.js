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
exports.MessageType = void 0;
const ArgumentType_1 = require("../ArgumentType");
const LambertError_1 = require("../LambertError");
const MESSAGE_LINK = /^https?:\/\/(canary\.|ptb\.)?discord(app)?.com\/channels\/((\d+)|(@me))\/(\d+)\/(\d+)/;
class MessageType extends ArgumentType_1.ArgumentType {
    constructor() {
        super({ id: "message" });
        this.slashType = 3;
    }
    // https://discord.com/channels/@me/565224190362517505/791286029701218326
    parse({ val, cmd, trigger }) {
        return __awaiter(this, void 0, void 0, function* () {
            val = val.toLowerCase();
            const link = val.match(MESSAGE_LINK);
            let message;
            let channel;
            let guildid;
            let channelid;
            let messageid;
            if (link) {
                guildid = link[3];
                channelid = link[6];
                messageid = link[7];
            }
            else if (trigger.reference) {
                trigger = trigger;
                guildid = trigger.reference.guildID;
                channelid = trigger.reference.channelID;
                messageid = trigger.reference.messageID;
            }
            else {
                guildid = trigger.guild.id;
                channelid = trigger.channel.id;
                messageid = val;
            }
            if (trigger.guild && guildid !== trigger.guild.id)
                throw new LambertError_1.LambertError(LambertError_1.ERRORS.DIFFERENT_GUILD, val);
            if (trigger.guild)
                channel = trigger.guild.channels.resolve(channelid);
            else
                channel = trigger.client.channels.resolve(channelid);
            if (!channel)
                throw new LambertError_1.LambertError(LambertError_1.ERRORS.NOT_A_CHANNEL, val);
            if (!channel.messages)
                throw new LambertError_1.LambertError(LambertError_1.ERRORS.NOT_A_TEXTCHANNEL, val);
            try {
                message = yield channel.messages.fetch(messageid);
                if (!message)
                    throw "msg not found";
            }
            catch (error) {
                throw new LambertError_1.LambertError(LambertError_1.ERRORS.NOT_A_MESSAGE, val);
            }
            return message;
        });
    }
}
exports.MessageType = MessageType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWVzc2FnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zdHJ1Y3R1cmVzL3R5cGVzL01lc3NhZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQ0Esa0RBQStDO0FBRS9DLGtEQUF1RDtBQUV2RCxNQUFNLFlBQVksR0FBRyx1RkFBdUYsQ0FBQztBQUU3RyxNQUFhLFdBQVksU0FBUSwyQkFBWTtJQUM1QztRQUNDLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0lBQ3BCLENBQUM7SUFFRCx5RUFBeUU7SUFDbkUsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQWdCOztZQUM5QyxHQUFHLEdBQUcsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ3hCLE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDckMsSUFBSSxPQUFnQixDQUFDO1lBQ3JCLElBQUksT0FBb0IsQ0FBQztZQUN6QixJQUFJLE9BQWUsQ0FBQztZQUNwQixJQUFJLFNBQWlCLENBQUM7WUFDdEIsSUFBSSxTQUFpQixDQUFDO1lBRXRCLElBQUksSUFBSSxFQUFFO2dCQUNULE9BQU8sR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xCLFNBQVMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BCLFNBQVMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDcEI7aUJBQU0sSUFBYyxPQUFRLENBQUMsU0FBUyxFQUFFO2dCQUN4QyxPQUFPLEdBQVksT0FBTyxDQUFDO2dCQUMzQixPQUFPLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUM7Z0JBQ3BDLFNBQVMsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQztnQkFDeEMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDO2FBQ3hDO2lCQUFNO2dCQUNOLE9BQU8sR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztnQkFDM0IsU0FBUyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO2dCQUMvQixTQUFTLEdBQUcsR0FBRyxDQUFDO2FBQ2hCO1lBRUQsSUFBSSxPQUFPLENBQUMsS0FBSyxJQUFJLE9BQU8sS0FBSyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQUUsTUFBTSxJQUFJLDJCQUFZLENBQUMscUJBQU0sQ0FBQyxlQUFlLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFFdkcsSUFBSSxPQUFPLENBQUMsS0FBSztnQkFBRSxPQUFPLEdBQWdCLE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQzs7Z0JBQy9FLE9BQU8sR0FBZ0IsT0FBTyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3ZFLElBQUksQ0FBQyxPQUFPO2dCQUFFLE1BQU0sSUFBSSwyQkFBWSxDQUFDLHFCQUFNLENBQUMsYUFBYSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ2hFLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUTtnQkFBRSxNQUFNLElBQUksMkJBQVksQ0FBQyxxQkFBTSxDQUFDLGlCQUFpQixFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBRTdFLElBQUk7Z0JBQ0gsT0FBTyxHQUFHLE1BQU0sT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQ2xELElBQUksQ0FBQyxPQUFPO29CQUFFLE1BQU0sZUFBZSxDQUFDO2FBQ3BDO1lBQUMsT0FBTyxLQUFLLEVBQUU7Z0JBQ2YsTUFBTSxJQUFJLDJCQUFZLENBQUMscUJBQU0sQ0FBQyxhQUFhLEVBQUUsR0FBRyxDQUFDLENBQUM7YUFDbEQ7WUFFRCxPQUFPLE9BQU8sQ0FBQztRQUNoQixDQUFDO0tBQUE7Q0FDRDtBQS9DRCxrQ0ErQ0MifQ==