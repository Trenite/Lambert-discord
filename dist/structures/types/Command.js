"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandType = void 0;
const ArgumentType_1 = require("../ArgumentType");
const LambertError_1 = require("../LambertError");
class CommandType extends ArgumentType_1.ArgumentType {
    constructor() {
        super({ id: "command" });
        this.slashType = 3;
    }
    parse({ val, cmd, trigger }) {
        val = val.toLowerCase();
        let command = trigger.client.registry.commands.getModule(val);
        if (!command)
            throw new LambertError_1.LambertError(LambertError_1.ERRORS.NOT_A_COMMAND, val);
        return command;
    }
}
exports.CommandType = CommandType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tbWFuZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zdHJ1Y3R1cmVzL3R5cGVzL0NvbW1hbmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsa0RBQStDO0FBRS9DLGtEQUF1RDtBQUV2RCxNQUFhLFdBQVksU0FBUSwyQkFBWTtJQUM1QztRQUNDLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0lBQ3BCLENBQUM7SUFFRCxLQUFLLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBZ0I7UUFDeEMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUV4QixJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRTlELElBQUksQ0FBQyxPQUFPO1lBQUUsTUFBTSxJQUFJLDJCQUFZLENBQUMscUJBQU0sQ0FBQyxhQUFhLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDaEUsT0FBTyxPQUFPLENBQUM7SUFDaEIsQ0FBQztDQUNEO0FBZEQsa0NBY0MifQ==