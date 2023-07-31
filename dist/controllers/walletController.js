"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewWalletBalance = void 0;
const http_status_1 = __importDefault(require("http-status"));
const functionsController_1 = require("../controllers/functionsController");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const helperFunctions_1 = require("../utills/helperFunctions");
const userSchema_1 = require("../models/userSchema");
const jwtsecret = process.env.JWT_SECRET;
const fromUser = process.env.FROM;
const ViewWalletBalance = async (req, res) => {
    try {
        const verified = req.headers.token;
        const token = jsonwebtoken_1.default.verify(verified, jwtsecret);
        const { _id } = token;
        const user = await userSchema_1.User.findOne({ _id: _id });
        if (!user) {
            return (0, helperFunctions_1.errorResponse)(res, 'Not an active user', http_status_1.default.NOT_FOUND);
        }
        const wallet = await (0, functionsController_1.getUserWalletById)(user._id);
        if (!wallet) {
            return (0, helperFunctions_1.errorResponse)(res, 'Wallet not found', http_status_1.default.NOT_FOUND);
        }
        else {
            return (0, helperFunctions_1.successResponse)(res, 'Wallet balance found', http_status_1.default.OK, { balance: wallet.balance });
        }
    }
    catch (error) {
        console.log(error);
    }
};
exports.ViewWalletBalance = ViewWalletBalance;
//# sourceMappingURL=walletController.js.map