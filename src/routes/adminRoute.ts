import express from 'express';
import { RegisterAdmin, LockAccount, LoginAdmin, ViewAllUsers } from "../controllers/adminController";
import { adminAuth } from "../middlewares/adminAuth";
import { createBilling, getCreatedBilling, updateBillingById } from '../controllers/flutter';
// import { createTestBilling, getAllPlans } from "../controllers/testBilling";
const router = express();


router.post('/admin-account', RegisterAdmin);
router.post('/admin-login', LoginAdmin);
router.get('/view-all-users', adminAuth, ViewAllUsers);
router.patch('/lock-account/:userId', adminAuth, LockAccount);
router.get('/view-all-billing', adminAuth, getCreatedBilling);
router.post('/create-billing', adminAuth, createBilling);
router.patch('/update-billing/:billingId', adminAuth, updateBillingById);

// Belrald Test Billing Details

// router.post('/create-billing-test', adminAuth, createTestBilling);
// router.get('/get-plans', adminAuth, getAllPlans);



export default router;