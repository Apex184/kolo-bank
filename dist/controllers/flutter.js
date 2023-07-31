"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.directDebit = exports.bankTransfer = exports.responses = exports.createPayments = void 0;
const got = require("got");
const Flutterwave = require('flutterwave-node-v3');
const flw = new Flutterwave(process.env.FLUTTERWAVE_V3_PUB_KEY, process.env.FLUTTERWAVE_V3_SECRET_KEY);
const generateFunc_1 = require("../utills/generateFunc");
const axios_1 = __importDefault(require("axios"));
const functionsController_1 = require("../controllers/functionsController");
const transactionSchema_1 = require("../models/transactionSchema");
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const helperFunctions_1 = require("../utills/helperFunctions");
const userSchema_1 = require("../models/userSchema");
const jwtsecret = process.env.JWT_SECRET;
const fromUser = process.env.FROM;
const createPayments = async (req, res, next) => {
    try {
        const verified = req.headers.token;
        const token = jsonwebtoken_1.default.verify(verified, jwtsecret);
        const { _id } = token;
        const user = await userSchema_1.User.findOne({ _id: _id });
        if (!user) {
            return (0, helperFunctions_1.errorResponse)(res, 'Not an active user', http_status_1.default.NOT_FOUND);
        }
        const { amount } = req.body;
        const transaction_id = (0, generateFunc_1.generateReference)();
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
        }).json();
        if (response) {
            return (0, helperFunctions_1.successResponse)(res, 'Payment initiated', http_status_1.default.OK, response);
        }
        else {
            return (0, helperFunctions_1.errorResponse)(res, 'An error occured', http_status_1.default.NOT_FOUND);
        }
    }
    catch (err) {
        console.log(err.code);
    }
};
exports.createPayments = createPayments;
const responses = async (req, res, next) => {
    try {
        const { transaction_id } = req.query;
        const url = `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`;
        const response = await (0, axios_1.default)({
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
            const transactionExist = await transactionSchema_1.Transaction.findOne({ transactionId: id });
            if (transactionExist) {
                return res.status(409).send("Transaction Already Exist");
            }
            const user = await userSchema_1.User.findOne({ email: customer.email });
            if (!user) {
                return res.status(404).send("User Not Found");
            }
            await (0, functionsController_1.createTransaction)(user._id, id, status, currency, amount, customer);
            await (0, functionsController_1.updateWallet)(user._id, amount);
            await (0, functionsController_1.createWalletTransaction)(user._id, status, currency, amount);
            return res.status(200).send("Payment successful");
        }
        else {
            return (0, helperFunctions_1.errorResponse)(res, 'Payment failed', http_status_1.default.BAD_REQUEST);
        }
    }
    catch (err) {
        console.log(err);
    }
};
exports.responses = responses;
const bankTransfer = async (req, res, next) => {
    try {
        const verified = req.headers.token;
        const token = jsonwebtoken_1.default.verify(verified, jwtsecret);
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
                };
                const response = await flw.Charge.bank_transfer(payload);
                console.log(response);
            }
            catch (error) {
                console.log(error);
            }
        };
        bank_trf();
    }
    catch (error) {
        console.log(error);
    }
};
exports.bankTransfer = bankTransfer;
const directDebit = async (req, res, next) => {
    try {
        const verified = req.headers.token;
        const token = jsonwebtoken_1.default.verify(verified, jwtsecret);
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
                };
                const response = await flw.Charge.ng(payload);
                console.log(response);
            }
            catch (error) {
                console.log(error);
            }
        };
        charge_ng_acct();
    }
    catch (error) {
        console.log(error);
    }
};
exports.directDebit = directDebit;
//# sourceMappingURL=flutter.js.map