"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooleanType = void 0;
const ArgumentType_1 = require("../ArgumentType");
const LambertError_1 = require("../LambertError");
class BooleanType extends ArgumentType_1.ArgumentType {
    constructor() {
        super({ id: "boolean" });
        this.slashType = 5;
    }
    parse({ val, cmd, trigger }) {
        val = typeof val === "string" ? val.toLowerCase() : val;
        const yes = ["yes", "y", "true", true];
        const no = ["no", "n", "false", false];
        if (yes.includes(val)) {
            return true;
        }
        if (no.includes(val)) {
            return false;
        }
        throw new LambertError_1.LambertError(LambertError_1.ERRORS.NOT_A_BOOLEAN, val);
    }
}
exports.BooleanType = BooleanType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQm9vbGVhbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zdHJ1Y3R1cmVzL3R5cGVzL0Jvb2xlYW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsa0RBQStDO0FBRS9DLGtEQUF1RDtBQUV2RCxNQUFhLFdBQVksU0FBUSwyQkFBWTtJQUM1QztRQUNDLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0lBQ3BCLENBQUM7SUFFRCxLQUFLLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBZ0I7UUFDeEMsR0FBRyxHQUFHLE9BQU8sR0FBRyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7UUFDeEQsTUFBTSxHQUFHLEdBQUcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN2QyxNQUFNLEVBQUUsR0FBRyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXZDLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUN0QixPQUFPLElBQUksQ0FBQztTQUNaO1FBQ0QsSUFBSSxFQUFFLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ3JCLE9BQU8sS0FBSyxDQUFDO1NBQ2I7UUFFRCxNQUFNLElBQUksMkJBQVksQ0FBQyxxQkFBTSxDQUFDLGFBQWEsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUNuRCxDQUFDO0NBQ0Q7QUFwQkQsa0NBb0JDIn0=