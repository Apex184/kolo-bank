"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        country: { type: String, required: true },
    },
    isVerified: {
        type: Boolean,
        default: false,
        required: true,
    },
    isBvnVerified: {
        type: Boolean,
        default: false,
        required: true,
    },
    isLocked: {
        type: Boolean,
        default: false,
        required: true,
    },
    bvn: {
        type: String,
        required: true,
    },
    accountType: {
        type: String,
        required: true,
        enum: ['savings', 'current', 'fixed_deposit'],
    },
    bankAccounts: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'BankAccount',
    },
    wallet: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Wallet',
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
}, {
    timestamps: true,
});
exports.User = mongoose_1.default.model('User', userSchema);
//# sourceMappingURL=userSchema.js.map