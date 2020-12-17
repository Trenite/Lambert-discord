"use strict";
// TODO: parse number/boolean
Object.defineProperty(exports, "__esModule", { value: true });
exports.instanceOf = void 0;
function instanceOf(type, value) {
    switch (type) {
        case String:
            if (typeof value === "string")
                return true;
            throw `${value} must be a string`;
        case Number:
            if (typeof value === "number" && !isNaN(value))
                return true;
            throw `${value} must be a number`;
        case BigInt:
            if (typeof value === "bigint")
                return true;
            throw `${value} must be a bigint`;
        case Boolean:
            if (typeof value === "boolean")
                return true;
            throw `${value} must be a boolean`;
    }
    if (typeof type === "object") {
        if (typeof value !== "object")
            throw `${value} must be a object`;
        if (Array.isArray(type)) {
            if (!Array.isArray(value))
                throw `${value} must be an array`;
            return type.every((t, i) => instanceOf(t, value[i]));
        }
        return Object.keys(type).every((key) => instanceOf(type[key], value[key]));
    }
    if (!type)
        return true; // no type was specified
    if (value instanceof type)
        return true;
    throw `${value} must be an instance of ${type}`;
}
exports.instanceOf = instanceOf;
//# sourceMappingURL=instanceOf.js.map