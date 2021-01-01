"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BigIntType = void 0;
const ArgumentType_1 = require("../ArgumentType");
const LambertError_1 = require("../LambertError");
class BigIntType extends ArgumentType_1.ArgumentType {
    constructor() {
        super({ id: "bigint" });
        this.slashType = 4;
    }
    parse({ val, cmd, trigger }) {
        try {
            return BigInt(val);
        }
        catch (error) {
            throw new LambertError_1.LambertError(LambertError_1.ERRORS.NOT_A_BIGINT, val);
        }
    }
}
exports.BigIntType = BigIntType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmlnaW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3N0cnVjdHVyZXMvdHlwZXMvQmlnaW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGtEQUErQztBQUUvQyxrREFBdUQ7QUFFdkQsTUFBYSxVQUFXLFNBQVEsMkJBQVk7SUFDM0M7UUFDQyxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUN4QixJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztJQUNwQixDQUFDO0lBRUQsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQWdCO1FBQ3hDLElBQUk7WUFDSCxPQUFPLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNuQjtRQUFDLE9BQU8sS0FBSyxFQUFFO1lBQ2YsTUFBTSxJQUFJLDJCQUFZLENBQUMscUJBQU0sQ0FBQyxZQUFZLEVBQUUsR0FBRyxDQUFDLENBQUM7U0FDakQ7SUFDRixDQUFDO0NBQ0Q7QUFiRCxnQ0FhQyJ9