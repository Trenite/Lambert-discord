"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const LambertRequest_1 = require("../LambertRequest");
const router = express_1.Router();
router.get("/", LambertRequest_1.check({
    guild: true,
    body: {
        test: String,
    },
}), (req, res) => {
    res.send(req.client.user.username);
});
exports.default = router;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvcm91dGVzL3Rlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxQ0FBaUM7QUFDakMsc0RBQTBDO0FBQzFDLE1BQU0sTUFBTSxHQUFHLGdCQUFNLEVBQUUsQ0FBQztBQUV4QixNQUFNLENBQUMsR0FBRyxDQUNULEdBQUcsRUFDSCxzQkFBSyxDQUFDO0lBQ0wsS0FBSyxFQUFFLElBQUk7SUFDWCxJQUFJLEVBQUU7UUFDTCxJQUFJLEVBQUUsTUFBTTtLQUNaO0NBQ0QsQ0FBQyxFQUNGLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFO0lBQ1osR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNwQyxDQUFDLENBQ0QsQ0FBQztBQUVGLGtCQUFlLE1BQU0sQ0FBQyJ9