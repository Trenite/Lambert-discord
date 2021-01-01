"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubCommandType = void 0;
const ArgumentType_1 = require("../ArgumentType");
class SubCommandType extends ArgumentType_1.ArgumentType {
    constructor() {
        super({ id: "subcommand" });
        this.slashType = 1;
    }
    parse({ val, cmd, trigger }) {
        // TODO parse sub commands
        return cmd.getModule(val);
    }
}
exports.SubCommandType = SubCommandType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3ViQ29tbWFuZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zdHJ1Y3R1cmVzL3R5cGVzL1N1YkNvbW1hbmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsa0RBQStDO0FBRy9DLE1BQWEsY0FBZSxTQUFRLDJCQUFZO0lBQy9DO1FBQ0MsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLFlBQVksRUFBRSxDQUFDLENBQUM7UUFDNUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7SUFDcEIsQ0FBQztJQUVELEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFnQjtRQUN4QywwQkFBMEI7UUFDMUIsT0FBTyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzNCLENBQUM7Q0FDRDtBQVZELHdDQVVDIn0=