"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const adminAuth_1 = require("../middlewares/adminAuth");
const flutter_1 = require("../controllers/flutter");
const testBilling_1 = require("../controllers/testBilling");
const router = (0, express_1.default)();
router.post('/admin-account', adminController_1.RegisterAdmin);
router.post('/admin-login', adminController_1.LoginAdmin);
router.get('/view-all-users', adminAuth_1.adminAuth, adminController_1.ViewAllUsers);
router.patch('/lock-account/:userId', adminAuth_1.adminAuth, adminController_1.LockAccount);
router.get('/view-all-billing', adminAuth_1.adminAuth, flutter_1.getCreatedBilling);
router.post('/create-billing', adminAuth_1.adminAuth, flutter_1.createBilling);
router.patch('/update-billing/:billingId', adminAuth_1.adminAuth, flutter_1.updateBillingById);
// Belrald Test Billing Details
router.post('/create-billing-test', adminAuth_1.adminAuth, testBilling_1.createTestBilling);
router.get('/get-plans', adminAuth_1.adminAuth, testBilling_1.getAllPlans);
exports.default = router;
//# sourceMappingURL=adminRoute.js.map