import express, { Request, Response, NextFunction } from 'express';
import { RegisterUser, verifyUser, LoginUser } from "../controllers/userController";
import { isAuthorized } from "../middlewares/userAuth";
import { belraldPayment } from '../controllers/flutter';
const router = express();


router.post('/register-account', RegisterUser);
router.get('/verify/:token', verifyUser);
router.post('/login', LoginUser);

//flutterwave test payment
router.post('/belrald-payment', isAuthorized, belraldPayment);



export default router;