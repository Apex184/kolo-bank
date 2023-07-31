"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const router = (0, express_1.default)();
router.post('/register-account', userController_1.RegisterUser);
router.get('/verify/:token', userController_1.verifyUser);
router.post('/login', userController_1.LoginUser);
exports.default = router;
//# sourceMappingURL=userRouter.js.map