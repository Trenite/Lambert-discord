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
exports.MemberType = void 0;
const ArgumentType_1 = require("../ArgumentType");
const LambertError_1 = require("../LambertError");
const Channel_1 = require("./Channel");
const USER_PATTERN = /^(?:<@!?)?([0-9]+)>?$/;
class MemberType extends ArgumentType_1.ArgumentType {
    constructor() {
        super({ id: "member" });
        this.slashType = 6;
    }
    parse({ val, cmd, trigger }) {
        return __awaiter(this, void 0, void 0, function* () {
            val = val.toLowerCase();
            const mention = val.match(USER_PATTERN);
            let member;
            if (mention)
                member = yield trigger.guild.members.fetch(mention[1]).catch(() => (member = null));
            else
                member = Channel_1.getMostSimilarCache(val, trigger.guild.members.cache, (x) => x.user.tag);
            if (!member)
                throw new LambertError_1.LambertError(LambertError_1.ERRORS.NOT_A_GUILD_MEMBER, val);
            return member;
        });
    }
}
exports.MemberType = MemberType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWVtYmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3N0cnVjdHVyZXMvdHlwZXMvTWVtYmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUNBLGtEQUErQztBQUUvQyxrREFBdUQ7QUFDdkQsdUNBQWdEO0FBQ2hELE1BQU0sWUFBWSxHQUFHLHVCQUF1QixDQUFDO0FBRTdDLE1BQWEsVUFBVyxTQUFRLDJCQUFZO0lBQzNDO1FBQ0MsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDeEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7SUFDcEIsQ0FBQztJQUVLLEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFnQjs7WUFDOUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUN4QixNQUFNLE9BQU8sR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ3hDLElBQUksTUFBbUIsQ0FBQztZQUV4QixJQUFJLE9BQU87Z0JBQUUsTUFBTSxHQUFHLE1BQU0sT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDOztnQkFDNUYsTUFBTSxHQUFnQiw2QkFBbUIsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRXBHLElBQUksQ0FBQyxNQUFNO2dCQUFFLE1BQU0sSUFBSSwyQkFBWSxDQUFDLHFCQUFNLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDcEUsT0FBTyxNQUFNLENBQUM7UUFDZixDQUFDO0tBQUE7Q0FDRDtBQWpCRCxnQ0FpQkMifQ==