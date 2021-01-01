"use strict";
// TODO: parse number/boolean
Object.defineProperty(exports, "__esModule", { value: true });
exports.instanceOf = void 0;
function instanceOf(type, value, path = "") {
    switch (type) {
        case String:
            if (typeof value === "string")
                return true;
            throw `${path} must be a string`;
        case Number:
            if (typeof value === "number" && !isNaN(value))
                return true;
            throw `${path} must be a number`;
        case BigInt:
            if (typeof value === "bigint")
                return true;
            throw `${path} must be a bigint`;
        case Boolean:
            if (typeof value === "boolean")
                return true;
            throw `${path} must be a boolean`;
    }
    if (typeof type === "object") {
        if (typeof value !== "object")
            throw `${path} must be a object`;
        if (Array.isArray(type)) {
            if (!Array.isArray(value))
                throw `${path} must be an array`;
            return type.every((t, i) => instanceOf(t, value[i], `${path}[${i}]`));
        }
        return Object.keys(type).every((key) => instanceOf(type[key], value[key], `${path}.${key}`));
    }
    if (!type)
        return true; // no type was specified
    if (value instanceof type)
        return true;
    throw `${path} must be an instance of ${type}`;
}
exports.instanceOf = instanceOf;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zdGFuY2VPZi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsL2luc3RhbmNlT2YudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDZCQUE2Qjs7O0FBRTdCLFNBQWdCLFVBQVUsQ0FBQyxJQUFTLEVBQUUsS0FBVSxFQUFFLE9BQWUsRUFBRTtJQUNsRSxRQUFRLElBQUksRUFBRTtRQUNiLEtBQUssTUFBTTtZQUNWLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUTtnQkFBRSxPQUFPLElBQUksQ0FBQztZQUMzQyxNQUFNLEdBQUcsSUFBSSxtQkFBbUIsQ0FBQztRQUNsQyxLQUFLLE1BQU07WUFDVixJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7Z0JBQUUsT0FBTyxJQUFJLENBQUM7WUFDNUQsTUFBTSxHQUFHLElBQUksbUJBQW1CLENBQUM7UUFDbEMsS0FBSyxNQUFNO1lBQ1YsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRO2dCQUFFLE9BQU8sSUFBSSxDQUFDO1lBQzNDLE1BQU0sR0FBRyxJQUFJLG1CQUFtQixDQUFDO1FBQ2xDLEtBQUssT0FBTztZQUNYLElBQUksT0FBTyxLQUFLLEtBQUssU0FBUztnQkFBRSxPQUFPLElBQUksQ0FBQztZQUM1QyxNQUFNLEdBQUcsSUFBSSxvQkFBb0IsQ0FBQztLQUNuQztJQUNELElBQUksT0FBTyxJQUFJLEtBQUssUUFBUSxFQUFFO1FBQzdCLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUTtZQUFFLE1BQU0sR0FBRyxJQUFJLG1CQUFtQixDQUFDO1FBQ2hFLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUN4QixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7Z0JBQUUsTUFBTSxHQUFHLElBQUksbUJBQW1CLENBQUM7WUFDNUQsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1NBQ3RFO1FBQ0QsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxJQUFJLElBQUksR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQzdGO0lBRUQsSUFBSSxDQUFDLElBQUk7UUFBRSxPQUFPLElBQUksQ0FBQyxDQUFDLHdCQUF3QjtJQUNoRCxJQUFJLEtBQUssWUFBWSxJQUFJO1FBQUUsT0FBTyxJQUFJLENBQUM7SUFDdkMsTUFBTSxHQUFHLElBQUksMkJBQTJCLElBQUksRUFBRSxDQUFDO0FBQ2hELENBQUM7QUEzQkQsZ0NBMkJDIn0=