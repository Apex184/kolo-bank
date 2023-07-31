import { Request, Response } from 'express';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import { getUserWalletById, sendMoneyToAnotherWallet } from "../controllers/functionsController";
import jwt from 'jsonwebtoken';
import { errorResponse, serverError, successResponse, successResponseLogin } from '../utills/helperFunctions';
import { User, UserInterface } from '../models/userSchema';
import { createWallet, createBankAccount } from '../controllers/functionsController';
import { BankAccount } from '../models/bankAcctSchema';
const jwtsecret = process.env.JWT_SECRET as string;
const fromUser = process.env.FROM as string;
interface jwtPayload {
    email: string;
    _id: mongoose.Types.ObjectId;

}

export const sendMoney = async (req: Request, res: Response): Promise<unknown> => {
    try {
        const verified = req.headers.token as string;
        const token = jwt.verify(verified, jwtsecret) as unknown as jwtPayload;
        const { _id } = token;
        const user = await User.findOne({ _id: _id });

        if (!user) {
            return errorResponse(res, 'Not an active user', httpStatus.NOT_FOUND);
        }
        const { amount, destination } = req.body;
        try {
            const transactionResult = await sendMoneyToAnotherWallet(user._id, amount, destination);
            if (transactionResult.success) {
                return res.send(transactionResult.messages);
            } else {
                return res.send(transactionResult.messages);
            }

        } catch (error) {
            console.log(error);
        }



    } catch (err) {
        console.log(err);
    }
}
