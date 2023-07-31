"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankAccount = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bankAcctSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    userWalletId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Wallet',
    },
    accountNumber: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        default: 0,
    }
});
exports.BankAccount = mongoose_1.default.model('BankAccount', bankAcctSchema);
//# sourceMappingURL=bankAcctSchema.js.map