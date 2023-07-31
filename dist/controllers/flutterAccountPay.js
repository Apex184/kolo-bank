"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.response = exports.createPayment = void 0;
const path_1 = __importDefault(require("path"));
const axios_1 = __importDefault(require("axios"));
const functionsController_1 = require("../controllers/functionsController");
const transactionSchema_1 = require("../models/transactionSchema");
const userSchema_1 = require("../models/userSchema");
const createPayment = async (req, res, next) => {
    try {
        res.sendFile(path_1.default.join(__dirname + "/public/index.html"));
    }
    catch (error) {
        console.log(error);
    }
};
exports.createPayment = createPayment;
const response = async (req, res, next) => {
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
        const data = response.data.data;
        const transactionExist = await transactionSchema_1.Transaction.findOne({ transactionId: id });
        if (transactionExist) {
            return res.status(409).send("Transaction Already Exist");
        }
        const user = await userSchema_1.User.findOne({ email: customer.email });
        if (!user) {
            return res.status(404).send("User Not Found");
        }
        const user_Id = user === null || user === void 0 ? void 0 : user._id;
        await (0, functionsController_1.createWalletTransaction)(user_Id, status, currency, amount);
        await (0, functionsController_1.createTransaction)(user_Id, id, status, currency, amount, customer);
        await (0, functionsController_1.updateWallet)(user_Id, amount);
    }
    catch (err) {
        console.log(err);
    }
};
exports.response = response;
//# sourceMappingURL=flutterAccountPay.js.map