"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Withdrawal = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const withdrawalSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    bankAccount: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'BankAccount',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    WithdrawalStatus: {
        type: String,
        enum: ["Pending", "Completed", "Failed"],
    }
});
exports.Withdrawal = mongoose_1.default.model('Withdrawal', withdrawalSchema);
//# sourceMappingURL=withdrawalSchema.js.map