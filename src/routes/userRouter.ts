import express, { Request, Response, NextFunction } from 'express';
import { RegisterUser, verifyUser, LoginUser } from "../controllers/userController";
import { isAuthorized } from "../middlewares/userAuth"
const router = express();


router.post('/register-account', RegisterUser);
router.get('/verify/:token', verifyUser);
router.post('/login', LoginUser);



export default router;