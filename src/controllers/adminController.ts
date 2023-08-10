import { Request, Response } from 'express';
import mongoose, { ObjectId } from 'mongoose';
import httpStatus from 'http-status';
import { User } from "../models/userSchema";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import { generateAdminLoginToken } from '../utills/validations';
import { errorResponse, serverError, successResponse, successResponseLogin } from '../utills/helperFunctions';
import mailer from '../mailers/sendMail';
import { emailVerificationView } from '../mailers/mailTemplate';
import { Admin, AdminIT } from '../models/adminSchema';
import { LockedUsersAccount } from '../controllers/functionsController';
const jwtsecret = process.env.ADMIN_SECRET_KEY as string;
const fromUser = process.env.FROM as string;
interface jwtPayload {
    email: string;
    _id: mongoose.Types.ObjectId;

}



export const RegisterAdmin = async (req: Request, res: Response): Promise<unknown> => {
    const registrationData: AdminIT = req.body;
    try {
        const duplicateEmail = await Admin.findOne({ email: req.body.email })

        if (duplicateEmail) {
            return errorResponse(res, 'Email already exists', httpStatus.CONFLICT);
        }

        const duplicatePhoneNumber = await Admin.findOne({
            phoneNumber: req.body.phoneNumber
        });

        if (duplicatePhoneNumber) {
            return errorResponse(res, 'Phone number already exists', httpStatus.CONFLICT);
        }
        const duplicateUserName = await Admin.findOne({
            username: req.body.username
        });

        if (duplicateUserName) {
            return errorResponse(res, 'Username already exists', httpStatus.CONFLICT);
        }

        const { email } = req.body;
        const hashPassword = await bcrypt.hash(req.body.password, 10);

        const user = await Admin.create({
            ...registrationData,
            password: hashPassword,
        });


        res.status(httpStatus.CREATED).json({
            message: 'User created successfully',
            data: {
                user,

            },
        });
    } catch (error) {
        console.error(error);
        return serverError(res);
    }
};


export const LoginAdmin = async (req: Request, res: Response): Promise<unknown> => {
    try {

        const user = await Admin.findOne({ email: req.body.email });
        if (!user) {
            return errorResponse(res, 'Incorrect credentials', httpStatus.BAD_REQUEST);
        }
        const validUser = await bcrypt.compare(req.body.password, user.password);
        if (!validUser) {
            return errorResponse(res, 'Incorrect credentials', httpStatus.BAD_REQUEST);
        }
        const { _id, email } = user;
        const token = generateAdminLoginToken({ _id: user._id, email: email });

        if (validUser) {
            return successResponseLogin(res, 'Login successfully', httpStatus.OK, user, token);
        }
    } catch (error) {
        console.log(error);
        return serverError(res);
    }
};


export const ViewAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find({ isVerified: true });
        if (!users) {
            return errorResponse(res, 'No user found', httpStatus.NOT_FOUND);
        }
        return successResponse(res, 'Users fetched successfully', httpStatus.OK, users);
    } catch (error) {
        console.log(error);
        return serverError(res);
    }
}


export const LockAccount = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const userObjectId = new mongoose.Schema.Types.ObjectId(userId);
        let { reason } = req.body;
        const locker = await LockedUsersAccount(userObjectId);
        if (!locker) {
            return errorResponse(res, 'User not found', httpStatus.NOT_FOUND);
        }
        // if (locker.reason) {
        //     return errorResponse(res, 'User already locked', httpStatus.CONFLICT);
        // }
        // reason = reason ? reason : 'No reason provided';
        // locker.reason = reason;
        // await locker.save();
        return successResponse(res, 'User locked successfully', httpStatus.OK, locker);

    } catch (error) {
        console.log(error);
        return serverError(res);
    }

}

