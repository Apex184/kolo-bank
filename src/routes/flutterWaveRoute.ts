import express from 'express';
import { createPayments, responses } from "../controllers/flutter";
import { isAuthorized } from "../middlewares/userAuth";
const router = express();

router.post('/fund-account', isAuthorized, createPayments);
router.get('/verify-transaction', responses)


export default router;