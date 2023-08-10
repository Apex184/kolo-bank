"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const adminAuth_1 = require("../middlewares/adminAuth");
const router = (0, express_1.default)();
router.post('/admin-account', adminController_1.RegisterAdmin);
router.post('/admin-login', adminController_1.LoginAdmin);
router.get('/view-all-users', adminAuth_1.adminAuth, adminController_1.ViewAllUsers);
router.patch('/lock-account/:userId', adminAuth_1.adminAuth, adminController_1.ViewAllUsers);
exports.default = router;
//# sourceMappingURL=adminRoute.js.map