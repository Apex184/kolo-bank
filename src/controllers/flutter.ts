const got = require("got");
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
import { User, UserInterface } from '../models/userSchema';
import { createWallet, createBankAccount } from '../controllers/functionsController';
import { BankAccount } from '../models/bankAcctSchema';
const jwtsecret = process.env.JWT_SECRET as string;
const fromUser = process.env.FROM as string;
interface jwtPayload {
    email: string;
    _id: mongoose.Types.ObjectId;

}

export const createPayments = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const verified = req.headers.token as string;
        const token = jwt.verify(verified, jwtsecret) as unknown as jwtPayload;
        const { _id } = token;
        const user = await User.findOne({ _id: _id }) as unknown as { [key: string]: string };
        if (!user) {
            return errorResponse(res, 'Not an active user', httpStatus.NOT_FOUND);
        }

        const { amount } = req.body

        const transaction_id = generateReference();

        const response = await got.post("https://api.flutterwave.com/v3/payments", {
            headers: {
                Authorization: `Bearer ${process.env.FLUTTERWAVE_V3_SECRET_KEY}`
            },
            json: {
                tx_ref: transaction_id,
                amount: amount,
                currency: "NGN",
                redirect_url: "http://localhost:8080/kolo/verify-transaction",
                meta: {
                    consumer_id: 23,
                    consumer_mac: "92a3-912ba-1192a",
                },
                customer: {
                    email: user.email,
                    phonenumber: user.phonenumber,
                    name: user.firstName,
                },
                customizations: {
                    title: "Belrald University",
                    logo: "http://www.piedpiper.com/app/themes/joystick-v27/images/logo.png"
                }
            }
        }).json()
        if (response) {
            return successResponse(res, 'Payment initiated', httpStatus.OK, response);
        }
        else {
            return errorResponse(res, 'An error occured', httpStatus.NOT_FOUND);
        }


    } catch (err: any) {
        console.log(err.code);

    }
}


export const responses = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { transaction_id } = req.query;
        const url = `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`;

        const response = await axios({
            url,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                'Access-Control-Allow-Origin': '*',
                credentials: true,
                Authorization: `Bearer ${process.env.FLUTTERWAVE_V3_SECRET_KEY}`,
            },
        });

        const { status, currency, id, amount, customer } = response.data.data;
        if (response.data.data) {
            const transactionExist = await Transaction.findOne({ transactionId: id });
            if (transactionExist) {
                return res.status(409).send("Transaction Already Exist");
            }
            const user = await User.findOne({ email: customer.email });
            if (!user) {
                return res.status(404).send("User Not Found");
            }
            await createTransaction(user._id, id, status, currency, amount, customer);
            await updateWallet(user._id, amount);
            await createWalletTransaction(user._id, status, currency, amount);

            return res.status(200).send("Payment successful");

        } else {
            return errorResponse(res, 'Payment failed', httpStatus.BAD_REQUEST);
        }


    } catch (err) {
        console.log(err)
    }

}

export const bankTransfer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const verified = req.headers.token as string;
        const token = jwt.verify(verified, jwtsecret) as unknown as jwtPayload;
        const { _id } = token;



        const bank_trf = async () => {

            try {

                const payload = {
                    "tx_ref": "MC-1585230950508",
                    "amount": "1500",
                    "email": "johnmadakin@gmail.com",
                    "phone_number": "054709929220",
                    "currency": "NGN",
                    "client_ip": "154.123.220.1",
                    "device_fingerprint": "62wd23423rq324323qew1",
                    "duration": 2,
                    "frequency": 5,
                    "narration": "All star college salary for May",
                    "is_permanent": 1,
                }

                const response = await flw.Charge.bank_transfer(payload)
                console.log(response);

            } catch (error) {
                console.log(error)
            }

        }

        bank_trf();



    } catch (error) {
        console.log(error)
    }
}

export const directDebit = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const verified = req.headers.token as string;
        const token = jwt.verify(verified, jwtsecret) as unknown as jwtPayload;
        const { _id } = token;

        const charge_ng_acct = async () => {

            try {

                const payload = {
                    "tx_ref": "example01",
                    "amount": "100",
                    "account_bank": "044",
                    "account_number": "0690000037",
                    "currency": "NGN",
                    "email": "olufemi@flw.com",
                    "phone_number": "09000000000",
                    "fullname": "Flutterwave Developers"
                }

                const response = await flw.Charge.ng(payload)
                console.log(response);
            } catch (error) {
                console.log(error)
            }

        }

        charge_ng_acct();
    } catch (error) {
        console.log(error)
    }
}


