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
exports.UserType = void 0;
const ArgumentType_1 = require("../ArgumentType");
const LambertError_1 = require("../LambertError");
const Channel_1 = require("./Channel");
const USER_PATTERN = /^(?:<@!?)?([0-9]+)>?$/;
class UserType extends ArgumentType_1.ArgumentType {
    constructor() {
        super({ id: "user" });
        this.slashType = 6;
    }
    parse({ val, cmd, trigger }) {
        return __awaiter(this, void 0, void 0, function* () {
            val = val.toLowerCase();
            const mention = val.match(USER_PATTERN);
            let user;
            if (mention)
                user = yield trigger.client.users.fetch(mention[1]).catch(() => (user = null));
            else
                user = Channel_1.getMostSimilarCache(val, trigger.client.users.cache, (x) => x.user.tag);
            if (!user)
                throw new LambertError_1.LambertError(LambertError_1.ERRORS.NOT_A_USER, val);
            return user;
        });
    }
}
exports.UserType = UserType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zdHJ1Y3R1cmVzL3R5cGVzL1VzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQ0Esa0RBQStDO0FBRS9DLGtEQUF1RDtBQUN2RCx1Q0FBZ0Q7QUFDaEQsTUFBTSxZQUFZLEdBQUcsdUJBQXVCLENBQUM7QUFFN0MsTUFBYSxRQUFTLFNBQVEsMkJBQVk7SUFDekM7UUFDQyxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUN0QixJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztJQUNwQixDQUFDO0lBRUssS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQWdCOztZQUM5QyxHQUFHLEdBQUcsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ3hCLE1BQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDeEMsSUFBSSxJQUFVLENBQUM7WUFFZixJQUFJLE9BQU87Z0JBQUUsSUFBSSxHQUFHLE1BQU0sT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDOztnQkFDdkYsSUFBSSxHQUFTLDZCQUFtQixDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFFMUYsSUFBSSxDQUFDLElBQUk7Z0JBQUUsTUFBTSxJQUFJLDJCQUFZLENBQUMscUJBQU0sQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDMUQsT0FBTyxJQUFJLENBQUM7UUFDYixDQUFDO0tBQUE7Q0FDRDtBQWpCRCw0QkFpQkMifQ==