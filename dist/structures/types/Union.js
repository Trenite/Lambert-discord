"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnionType = void 0;
const ArgumentType_1 = require("../ArgumentType");
const LambertError_1 = require("../LambertError");
class UnionType extends ArgumentType_1.ArgumentType {
    constructor() {
        super({ id: "union" });
        this.slashType = 3;
    }
    parse({ val, cmd, trigger }) {
        if (typeof val !== "string")
            throw new LambertError_1.LambertError(LambertError_1.ERRORS.NOT_A_STRING, val);
        return val;
    }
}
exports.UnionType = UnionType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVW5pb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvc3RydWN0dXJlcy90eXBlcy9Vbmlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxrREFBK0M7QUFFL0Msa0RBQXVEO0FBRXZELE1BQWEsU0FBVSxTQUFRLDJCQUFZO0lBQzFDO1FBQ0MsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7UUFDdkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7SUFDcEIsQ0FBQztJQUVELEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFnQjtRQUN4QyxJQUFJLE9BQU8sR0FBRyxLQUFLLFFBQVE7WUFBRSxNQUFNLElBQUksMkJBQVksQ0FBQyxxQkFBTSxDQUFDLFlBQVksRUFBRSxHQUFHLENBQUMsQ0FBQztRQUM5RSxPQUFPLEdBQUcsQ0FBQztJQUNaLENBQUM7Q0FDRDtBQVZELDhCQVVDIn0=