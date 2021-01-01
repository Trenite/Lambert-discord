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
exports.test = void 0;
const Command_1 = require("../Command");
class test extends Command_1.Command {
    constructor(handler) {
        super({
            handler,
            id: "test",
            description: "test command",
            aliases: ["hi"],
            args: [
                // {
                // 	id: "member",
                // 	type: "member",
                // 	description: "test arg",
                // 	required: true,
                // },
                // {
                // 	id: "bigint",
                // 	type: "bigint",
                // 	description: "bigint",
                // 	required: true,
                // },
                // {
                // 	id: "boolean",
                // 	type: "boolean",
                // 	description: "boolean",
                // 	required: true,
                // },
                // {
                // 	id: "channel",
                // 	type: "channel",
                // 	description: "channel",
                // 	required: true,
                // },
                // {
                // 	id: "integer",
                // 	type: "integer",
                // 	description: "integer",
                // 	required: true,
                // },
                // {
                // 	id: "categorychannel",
                // 	type: "categorychannel",
                // 	description: "categorychannel",
                // 	required: true,
                // },
                // {
                // 	id: "command",
                // 	type: "command",
                // 	description: "command",
                // 	required: true,
                // },
                // {
                // 	id: "message",
                // 	type: "message",
                // 	description: "message",
                // 	required: true,
                // },
                // {
                // 	id: "number",
                // 	type: "number",
                // 	description: "number",
                // 	required: true,
                // },
                // {
                // 	id: "role",
                // 	type: "role",
                // 	description: "role",
                // 	required: true,
                // },
                {
                    id: "string",
                    type: "string",
                    description: "string",
                    required: true,
                },
                // {
                // 	id: "subcommand",
                // 	type: "subcommand",
                // 	description: "subcommand",
                // },
                {
                    id: "textchannel",
                    type: "textchannel",
                    description: "textchannel",
                    required: true,
                },
                {
                    id: "union",
                    type: "union",
                    description: "union",
                    default: ["test", "hello"],
                    required: true,
                },
                {
                    id: "user",
                    type: "user",
                    description: "user",
                    required: true,
                },
                {
                    id: "voicechannel",
                    type: "voicechannel",
                    description: "voicechannel",
                    required: true,
                },
            ],
        });
    }
    exec(trigger, args) {
        return __awaiter(this, void 0, void 0, function* () {
            yield trigger.ack({ showUsage: true }, "hi");
            console.log(args);
        });
    }
}
exports.test = test;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zdHJ1Y3R1cmVzL2NvbW1hbmRzL3Rlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsd0NBQXFDO0FBSXJDLE1BQWEsSUFBSyxTQUFRLGlCQUFPO0lBQ2hDLFlBQVksT0FBeUI7UUFDcEMsS0FBSyxDQUFDO1lBQ0wsT0FBTztZQUNQLEVBQUUsRUFBRSxNQUFNO1lBQ1YsV0FBVyxFQUFFLGNBQWM7WUFDM0IsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDO1lBQ2YsSUFBSSxFQUFFO2dCQUNMLElBQUk7Z0JBQ0osaUJBQWlCO2dCQUNqQixtQkFBbUI7Z0JBQ25CLDRCQUE0QjtnQkFDNUIsbUJBQW1CO2dCQUNuQixLQUFLO2dCQUNMLElBQUk7Z0JBQ0osaUJBQWlCO2dCQUNqQixtQkFBbUI7Z0JBQ25CLDBCQUEwQjtnQkFDMUIsbUJBQW1CO2dCQUNuQixLQUFLO2dCQUNMLElBQUk7Z0JBQ0osa0JBQWtCO2dCQUNsQixvQkFBb0I7Z0JBQ3BCLDJCQUEyQjtnQkFDM0IsbUJBQW1CO2dCQUNuQixLQUFLO2dCQUNMLElBQUk7Z0JBQ0osa0JBQWtCO2dCQUNsQixvQkFBb0I7Z0JBQ3BCLDJCQUEyQjtnQkFDM0IsbUJBQW1CO2dCQUNuQixLQUFLO2dCQUNMLElBQUk7Z0JBQ0osa0JBQWtCO2dCQUNsQixvQkFBb0I7Z0JBQ3BCLDJCQUEyQjtnQkFDM0IsbUJBQW1CO2dCQUNuQixLQUFLO2dCQUNMLElBQUk7Z0JBQ0osMEJBQTBCO2dCQUMxQiw0QkFBNEI7Z0JBQzVCLG1DQUFtQztnQkFDbkMsbUJBQW1CO2dCQUNuQixLQUFLO2dCQUNMLElBQUk7Z0JBQ0osa0JBQWtCO2dCQUNsQixvQkFBb0I7Z0JBQ3BCLDJCQUEyQjtnQkFDM0IsbUJBQW1CO2dCQUNuQixLQUFLO2dCQUNMLElBQUk7Z0JBQ0osa0JBQWtCO2dCQUNsQixvQkFBb0I7Z0JBQ3BCLDJCQUEyQjtnQkFDM0IsbUJBQW1CO2dCQUNuQixLQUFLO2dCQUNMLElBQUk7Z0JBQ0osaUJBQWlCO2dCQUNqQixtQkFBbUI7Z0JBQ25CLDBCQUEwQjtnQkFDMUIsbUJBQW1CO2dCQUNuQixLQUFLO2dCQUNMLElBQUk7Z0JBQ0osZUFBZTtnQkFDZixpQkFBaUI7Z0JBQ2pCLHdCQUF3QjtnQkFDeEIsbUJBQW1CO2dCQUNuQixLQUFLO2dCQUNMO29CQUNDLEVBQUUsRUFBRSxRQUFRO29CQUNaLElBQUksRUFBRSxRQUFRO29CQUNkLFdBQVcsRUFBRSxRQUFRO29CQUNyQixRQUFRLEVBQUUsSUFBSTtpQkFDZDtnQkFDRCxJQUFJO2dCQUNKLHFCQUFxQjtnQkFDckIsdUJBQXVCO2dCQUN2Qiw4QkFBOEI7Z0JBQzlCLEtBQUs7Z0JBQ0w7b0JBQ0MsRUFBRSxFQUFFLGFBQWE7b0JBQ2pCLElBQUksRUFBRSxhQUFhO29CQUNuQixXQUFXLEVBQUUsYUFBYTtvQkFDMUIsUUFBUSxFQUFFLElBQUk7aUJBQ2Q7Z0JBQ0Q7b0JBQ0MsRUFBRSxFQUFFLE9BQU87b0JBQ1gsSUFBSSxFQUFFLE9BQU87b0JBQ2IsV0FBVyxFQUFFLE9BQU87b0JBQ3BCLE9BQU8sRUFBRSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUM7b0JBQzFCLFFBQVEsRUFBRSxJQUFJO2lCQUNkO2dCQUNEO29CQUNDLEVBQUUsRUFBRSxNQUFNO29CQUNWLElBQUksRUFBRSxNQUFNO29CQUNaLFdBQVcsRUFBRSxNQUFNO29CQUNuQixRQUFRLEVBQUUsSUFBSTtpQkFDZDtnQkFDRDtvQkFDQyxFQUFFLEVBQUUsY0FBYztvQkFDbEIsSUFBSSxFQUFFLGNBQWM7b0JBQ3BCLFdBQVcsRUFBRSxjQUFjO29CQUMzQixRQUFRLEVBQUUsSUFBSTtpQkFDZDthQUNEO1NBQ0QsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVLLElBQUksQ0FBQyxPQUF1QixFQUFFLElBQVM7O1lBQzVDLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUM3QyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ25CLENBQUM7S0FBQTtDQUNEO0FBaEhELG9CQWdIQyJ9