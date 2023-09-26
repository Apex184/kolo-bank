const got = require("got");
import request from 'request';
const Flutterwave = require('flutterwave-node-v3');
const flw = new Flutterwave(process.env.FLUTTERWAVE_V3_PUB_KEY, process.env.FLUTTERWAVE_V3_SECRET_KEY);
import { generateReference } from "../utills/generateFunc";
import { Request, Response, NextFunction } from 'express';
import path from "path";
import axios from "axios";
import {
    createWalletTransaction,
    createTransaction, updateWallet
} from "../controllers/functionsController";
import { Transaction } from "../models/transactionSchema";
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import { errorResponse, serverError, successResponse, successResponseLogin } from '../utills/helperFunctions';
import { User } from '../models/userSchema';
const jwtsecret = process.env.JWT_SECRET as string;
const fromUser = process.env.FROM as string;
import { findAllUsers, sendBillingPlanToUser } from '../controllers/functionsController';
interface jwtPayload {
    email: string;
    _id: mongoose.Types.ObjectId;

}

// Install with: npm i flutterwave-node-v3
//payment plan endpoint
export const createTestBilling = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { interval, name } = req.body;
        const payload = {
            name: name,
            interval: interval,
            currency: "NGN",
        };

        const response = await flw.PaymentPlan.create(payload);
        console.log(response);
        return res.status(200).json({
            status: "success",
            data: response
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "error",
            message: "Something went wrong, please try again later"
        });
    }
}

export const getAllPlans = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const url = `https://api.flutterwave.com/v3/payment-plans`;
        const options = {
            'method': 'GET',
            url: url,
            'headers': {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.FLUTTERWAVE_V3_SECRET_KEY} `,
            },
        };

        request(options, function (error: string | undefined, response: { body: string; }) {
            if (error) {
                console.error('Error:', error);
                return res.status(500).json({ success: false, message: 'An error occurred while getting billing.' });
            }
            const responseData = JSON.parse(response.body);
            return res.status(200).json({ success: true, message: 'Billing retrieved successfully.', responseData });
        });

    } catch (error) {
        console.log(error)
    }
}
export const getAllSubscribers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;
        // to return every subscription
        // const response = await flw.Subscription.fetch_all();

        // to return a single subscription
        const payload = { "email": "developers@flutterwavego.com" };
        const response = await flw.Subscription.get();

    } catch (error) {
        console.log(error)
    }
}



//payments endpoint




