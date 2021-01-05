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
exports.SubCommandType = void 0;
const ArgumentType_1 = require("../ArgumentType");
class SubCommandType extends ArgumentType_1.ArgumentType {
    constructor() {
        super({ id: "subcommand" });
        this.slashType = 1;
    }
    parse({ val, cmd, trigger }) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO parse sub commands and their args
            const split = val.split(" ");
            const subcommandName = split[0];
            const subcommand = cmd.getModule(subcommandName);
            const subargs = yield subcommand.getArgs({ trigger, args: split.slice(1).join(" ") });
            return { subargs, subcommand };
        });
    }
}
exports.SubCommandType = SubCommandType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3ViQ29tbWFuZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zdHJ1Y3R1cmVzL3R5cGVzL1N1YkNvbW1hbmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsa0RBQStDO0FBRy9DLE1BQWEsY0FBZSxTQUFRLDJCQUFZO0lBQy9DO1FBQ0MsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLFlBQVksRUFBRSxDQUFDLENBQUM7UUFDNUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7SUFDcEIsQ0FBQztJQUVLLEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFnQjs7WUFDOUMseUNBQXlDO1lBRXpDLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDN0IsTUFBTSxjQUFjLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hDLE1BQU0sVUFBVSxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDakQsTUFBTSxPQUFPLEdBQUcsTUFBTSxVQUFVLENBQUMsT0FBTyxDQUFDLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDdEYsT0FBTyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsQ0FBQztRQUNoQyxDQUFDO0tBQUE7Q0FDRDtBQWZELHdDQWVDIn0=