import express from 'express';
import { ViewWalletBalance } from "../controllers/walletController";
import { sendMoney } from "../controllers/sendMoneyController";
import { isAuthorized } from "../middlewares/userAuth"
const router = express();


router.get('/wallet-balance', isAuthorized, ViewWalletBalance);
router.post('/send-fund', isAuthorized, sendMoney);




export default router;