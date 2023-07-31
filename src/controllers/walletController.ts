import { Request, Response } from 'express';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import { getUserWalletById } from "../controllers/functionsController";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import { generateLoginToken } from '../utills/validations';
import { errorResponse, serverError, successResponse, successResponseLogin } from '../utills/helperFunctions';
import mailer from '../mailers/sendMail';
import { Wallet } from "../models/walletShema";
import { emailVerificationView } from '../mailers/mailTemplate';
import { User, UserInterface } from '../models/userSchema';
import { createWallet, createBankAccount } from '../controllers/functionsController';
import { BankAccount } from '../models/bankAcctSchema';
const jwtsecret = process.env.JWT_SECRET as string;
const fromUser = process.env.FROM as string;
interface jwtPayload {
    email: string;
    _id: mongoose.Types.ObjectId;

}

export const ViewWalletBalance = async (req: Request, res: Response): Promise<unknown> => {
    try {
        const verified = req.headers.token as string;
        const token = jwt.verify(verified, jwtsecret) as unknown as jwtPayload;
        const { _id } = token;

        const user = await User.findOne({ _id: _id });
        if (!user) {
            return errorResponse(res, 'Not an active user', httpStatus.NOT_FOUND);
        }
        const wallet = await getUserWalletById(user._id);
        if (!wallet) {
            return errorResponse(res, 'Wallet not found', httpStatus.NOT_FOUND);
        } else {
            return successResponse(res, 'Wallet balance found', httpStatus.OK, { balance: wallet.balance });
        }

    } catch (error) {
        console.log(error)
    }
}