"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTPError = void 0;
class HTTPError extends Error {
    constructor(title, code = 400) {
        super(title);
        this.title = title;
        this.code = code;
    }
}
exports.HTTPError = HTTPError;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSFRUUEVycm9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FwaS9IVFRQRXJyb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsTUFBYSxTQUFVLFNBQVEsS0FBSztJQUNuQyxZQUFtQixLQUFhLEVBQVMsT0FBZSxHQUFHO1FBQzFELEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQURLLFVBQUssR0FBTCxLQUFLLENBQVE7UUFBUyxTQUFJLEdBQUosSUFBSSxDQUFjO0lBRTNELENBQUM7Q0FDRDtBQUpELDhCQUlDIn0=