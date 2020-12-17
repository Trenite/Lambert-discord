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
exports.check = void 0;
const LambertRequest_1 = require("./LambertRequest");
function check(options) {
    return __awaiter(this, void 0, void 0, function* () {
        return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            var { permissions, parameter } = options;
            if (!permissions)
                permissions = [];
            if (!Array.isArray(permissions))
                permissions = [permissions];
            if (!parameter)
                parameter = {};
            if (permissions.length && !parameter.member)
                parameter.user = true;
            // if (permissions.find((x) => PermissionString))
            yield LambertRequest_1.patchRequest(req, res, Object.assign(Object.assign({}, parameter), { client: options.client }));
            yield ((_a = req.user) === null || _a === void 0 ? void 0 : _a.hasAuths(permissions, true));
            yield ((_b = req.member) === null || _b === void 0 ? void 0 : _b.hasAuths(permissions, true));
        });
    });
}
exports.check = check;
// check({ permissions: "DEV" });
//# sourceMappingURL=Route.js.map