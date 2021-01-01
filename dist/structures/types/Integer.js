"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegerType = void 0;
const ArgumentType_1 = require("../ArgumentType");
const LambertError_1 = require("../LambertError");
class IntegerType extends ArgumentType_1.ArgumentType {
    constructor() {
        super({ id: "integer" });
        this.slashType = 4;
    }
    parse({ val, cmd, trigger }) {
        const number = parseInt(val);
        if (isNaN(number) || val == null)
            throw new LambertError_1.LambertError(LambertError_1.ERRORS.NOT_A_NUMBER, val);
        return number;
    }
}
exports.IntegerType = IntegerType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW50ZWdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zdHJ1Y3R1cmVzL3R5cGVzL0ludGVnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsa0RBQStDO0FBRS9DLGtEQUF1RDtBQUV2RCxNQUFhLFdBQVksU0FBUSwyQkFBWTtJQUM1QztRQUNDLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0lBQ3BCLENBQUM7SUFFRCxLQUFLLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBZ0I7UUFDeEMsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzdCLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsSUFBSSxJQUFJO1lBQUUsTUFBTSxJQUFJLDJCQUFZLENBQUMscUJBQU0sQ0FBQyxZQUFZLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDbkYsT0FBTyxNQUFNLENBQUM7SUFDZixDQUFDO0NBQ0Q7QUFYRCxrQ0FXQyJ9