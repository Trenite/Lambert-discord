"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Snowflake = void 0;
const mongoose_1 = require("mongoose");
class Snowflake extends mongoose_1.SchemaType {
    constructor(key, options) {
        super(key, options, "Snowflake");
    }
    cast(val) {
        // TODO: check val
        if (typeof val !== "string")
            throw new Error("Snowflake must be a string");
        return val;
    }
}
exports.Snowflake = Snowflake;
// @ts-ignore
mongoose_1.Schema.Types["Snowflake"] = Snowflake;
//# sourceMappingURL=Snowflake.js.map