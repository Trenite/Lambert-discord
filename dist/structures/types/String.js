"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringType = void 0;
const ArgumentType_1 = require("../ArgumentType");
const LambertError_1 = require("../LambertError");
class StringType extends ArgumentType_1.ArgumentType {
    constructor() {
        super({ id: "string" });
        this.slashType = 3;
    }
    parse({ val, cmd, trigger }) {
        if (typeof val !== "string")
            throw new LambertError_1.LambertError(LambertError_1.ERRORS.NOT_A_STRING, val);
        return val;
    }
}
exports.StringType = StringType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3RyaW5nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3N0cnVjdHVyZXMvdHlwZXMvU3RyaW5nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGtEQUErQztBQUUvQyxrREFBdUQ7QUFFdkQsTUFBYSxVQUFXLFNBQVEsMkJBQVk7SUFDM0M7UUFDQyxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUN4QixJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztJQUNwQixDQUFDO0lBRUQsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQWdCO1FBQ3hDLElBQUksT0FBTyxHQUFHLEtBQUssUUFBUTtZQUFFLE1BQU0sSUFBSSwyQkFBWSxDQUFDLHFCQUFNLENBQUMsWUFBWSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzlFLE9BQU8sR0FBRyxDQUFDO0lBQ1osQ0FBQztDQUNEO0FBVkQsZ0NBVUMifQ==