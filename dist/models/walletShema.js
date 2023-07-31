"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wallet = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const walletSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    balance: {
        type: Number,
        default: 0,
    },
    currency: {
        type: String,
        default: 'NGN',
    },
    walletStatus: {
        type: String,
        enum: ["Active", "Disabled"],
        default: "Active"
    },
    lastFunded: {
        type: Date,
        default: Date.now,
    }
});
exports.Wallet = mongoose_1.default.model('Wallet', walletSchema);
//# sourceMappingURL=walletShema.js.map