import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import { generateLoginToken } from '../utills/validations';
import { errorResponse, serverError, successResponse, successResponseLogin } from '../utills/helperFunctions';
import mailer from '../mailers/sendMail';
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



export const RegisterUser = async (req: Request, res: Response): Promise<unknown> => {
    const registrationData: UserInterface = req.body;
    try {
        const duplicateEmail = await User.findOne({ email: req.body.email })

        if (duplicateEmail) {
            return errorResponse(res, 'Email already exists', httpStatus.CONFLICT);
        }

        const duplicatePhoneNumber = await User.findOne({
            phoneNumber: req.body.phoneNumber
        });

        if (duplicatePhoneNumber) {
            return errorResponse(res, 'Phone number already exists', httpStatus.CONFLICT);
        }
        const duplicateUserName = await User.findOne({
            username: req.body.username
        });

        if (duplicateUserName) {
            return errorResponse(res, 'Username already exists', httpStatus.CONFLICT);
        }

        const { email } = req.body;
        const hashPassword = await bcrypt.hash(req.body.password, 10);

        const user = await User.create({
            ...registrationData,
            password: hashPassword,
        });

        await createWallet(user._id);
        const accountNumber = await createBankAccount(user._id);

        await BankAccount.create({
            user: user._id,
            accountNumber,
        });

        const token = generateLoginToken({ _id: user._id, email: email });
        if (user) {
            const html = emailVerificationView(token);
            await mailer.sendEmail(fromUser, req.body.email, 'Please verify your email', html);
        }

        res.status(httpStatus.CREATED).json({
            message: 'User created successfully',
            data: {
                user,
                token,
            },
        });
    } catch (error) {
        console.error(error);
        return serverError(res); // You should define the serverError function to send a proper error response
    }
};


export async function verifyUser(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.params.token;

        try {
            const { email, _id } = jwt.verify(token, jwtsecret) as jwtPayload;
            console.log(email);
            console.log(_id);
            if (!email) {
                return errorResponse(res, "Verification failed: Email not found in token", httpStatus.BAD_REQUEST);
            }

            const user = await User.findOne({ email: email });

            if (!user) {
                return errorResponse(res, "Verification failed: User not found", httpStatus.NOT_FOUND);
            }

            if (user.isVerified) {
                return errorResponse(res, "Email is already verified", httpStatus.CONFLICT);
            }

            const updated = await User.findOneAndUpdate(
                { email: email },
                { $set: { isVerified: true } },
                { new: true }
            );

            return successResponse(res, "Email verified successfully", httpStatus.OK, updated);
        } catch (error) {
            console.error(error);
            return errorResponse(res, "Verification failed: Invalid or expired token", httpStatus.BAD_REQUEST);
        }

    } catch (error) {
        console.log(error);
        return serverError(res);
    }
}



export const LoginUser = async (req: Request, res: Response): Promise<unknown> => {
    try {

        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return errorResponse(res, 'Incorrect credentials', httpStatus.BAD_REQUEST);
        }
        const validUser = await bcrypt.compare(req.body.password, user.password);
        if (!validUser) {
            return errorResponse(res, 'Incorrect credentials', httpStatus.BAD_REQUEST);
        }
        const { id, email } = user;
        const token = generateLoginToken({ _id: user._id, email: email });
        if (!user.isVerified) {
            return errorResponse(res, 'Kindly verify your email', httpStatus.UNAUTHORIZED);
        }
        if (validUser) {
            return successResponseLogin(res, 'Login successfully', httpStatus.OK, user, token);
        }
    } catch (error) {
        console.log(error);
        return serverError(res);
    }
};


