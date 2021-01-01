"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumberType = void 0;
const ArgumentType_1 = require("../ArgumentType");
const LambertError_1 = require("../LambertError");
class NumberType extends ArgumentType_1.ArgumentType {
    constructor() {
        super({ id: "number" });
        this.slashType = 3;
    }
    parse({ val, cmd, trigger }) {
        const number = Number(val);
        if (isNaN(number) || val == null)
            throw new LambertError_1.LambertError(LambertError_1.ERRORS.NOT_A_NUMBER, val);
        return number;
    }
}
exports.NumberType = NumberType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTnVtYmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3N0cnVjdHVyZXMvdHlwZXMvTnVtYmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGtEQUErQztBQUUvQyxrREFBdUQ7QUFFdkQsTUFBYSxVQUFXLFNBQVEsMkJBQVk7SUFDM0M7UUFDQyxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUN4QixJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztJQUNwQixDQUFDO0lBRUQsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQWdCO1FBQ3hDLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMzQixJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksSUFBSTtZQUFFLE1BQU0sSUFBSSwyQkFBWSxDQUFDLHFCQUFNLENBQUMsWUFBWSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ25GLE9BQU8sTUFBTSxDQUFDO0lBQ2YsQ0FBQztDQUNEO0FBWEQsZ0NBV0MifQ==