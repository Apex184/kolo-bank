"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withdrawalStatus = exports.withdraw = exports.getAllBanksNG = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const Flutterwave = require('flutterwave-node-v3');
const publicKey = process.env.FLW_PUBLIC_KEY || 'public';
const secretKey = process.env.FLW_SECRET_KEY || 'secret';
const flw = new Flutterwave(publicKey, secretKey);
const BASE_API_URL = 'https://api.flutterwave.com/v3';
const bankUrl = `${BASE_API_URL}/banks/NG`;
const options = {
    method: 'GET',
    headers: {
        Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
    },
};
const getAllBanksNG = async () => {
    const response = await axios_1.default.get(bankUrl, options);
    return response.data;
};
exports.getAllBanksNG = getAllBanksNG;
async function withdraw(details) {
    const response = await flw.Transfer.initiate(details);
    return response;
}
exports.withdraw = withdraw;
const withdrawalStatus = async ({ id: payload }) => {
    const status = await flw.Transfer.get_a_transfer({ id: payload });
    return status;
};
exports.withdrawalStatus = withdrawalStatus;
//# sourceMappingURL=flutterWave.js.map