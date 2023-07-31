import express from 'express';
import { RegisterAdmin, LoginAdmin, ViewAllUsers } from "../controllers/adminController";
import { adminAuth } from "../middlewares/adminAuth";
const router = express();


router.post('/admin-account', RegisterAdmin);
router.post('/admin-login', LoginAdmin);
router.get('/view-all-users', adminAuth, ViewAllUsers);


export default router;