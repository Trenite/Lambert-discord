"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleType = void 0;
const ArgumentType_1 = require("../ArgumentType");
const LambertError_1 = require("../LambertError");
const Channel_1 = require("./Channel");
const ROLE_PATTERN = /^(?:<@&)?([0-9]+)>?$/;
class RoleType extends ArgumentType_1.ArgumentType {
    constructor() {
        super({ id: "role" });
        this.slashType = 8;
    }
    parse({ val, cmd, trigger }) {
        val = val.toLowerCase();
        const mention = val.match(ROLE_PATTERN);
        let role;
        if (!trigger.guild)
            throw new LambertError_1.LambertError(LambertError_1.ERRORS.GUILD_ONLY, { command: cmd, trigger });
        if (mention)
            role = trigger.guild.roles.resolve(mention[1]);
        else
            role = Channel_1.getMostSimilarCache(val, trigger.guild.roles.cache, (x) => x.name);
        if (!role)
            throw new LambertError_1.LambertError(LambertError_1.ERRORS.NOT_A_ROLE, val);
        return role;
    }
}
exports.RoleType = RoleType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUm9sZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zdHJ1Y3R1cmVzL3R5cGVzL1JvbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0Esa0RBQStDO0FBRS9DLGtEQUF1RDtBQUN2RCx1Q0FBZ0Q7QUFDaEQsTUFBTSxZQUFZLEdBQUcsc0JBQXNCLENBQUM7QUFFNUMsTUFBYSxRQUFTLFNBQVEsMkJBQVk7SUFDekM7UUFDQyxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUN0QixJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztJQUNwQixDQUFDO0lBRUQsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQWdCO1FBQ3hDLEdBQUcsR0FBRyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDeEIsTUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUN4QyxJQUFJLElBQVUsQ0FBQztRQUVmLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSztZQUFFLE1BQU0sSUFBSSwyQkFBWSxDQUFDLHFCQUFNLENBQUMsVUFBVSxFQUFFLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBRXpGLElBQUksT0FBTztZQUFFLElBQUksR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7O1lBQ3ZELElBQUksR0FBRyw2QkFBbUIsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFL0UsSUFBSSxDQUFDLElBQUk7WUFBRSxNQUFNLElBQUksMkJBQVksQ0FBQyxxQkFBTSxDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUMxRCxPQUFPLElBQUksQ0FBQztJQUNiLENBQUM7Q0FDRDtBQW5CRCw0QkFtQkMifQ==