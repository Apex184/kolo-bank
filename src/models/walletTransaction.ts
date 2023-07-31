import mongoose, { Schema, Document } from 'mongoose';

export interface WalletITS extends Document {
    userId: mongoose.Types.ObjectId;
    paymentStatus: string;
    amount: number;
    currency: string;
    status: string;
    isInflow: Boolean;
    paymentMethod: string;
}

const walletSchema = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        amount: {
            type: Number,
            default: 0,
        },
        isInflow: {
            type: Boolean,
        },
        paymentMethod: {
            type: String,
            default: 'flutterwave',
        },
        currency: {
            type: String,
            required: [true, 'currency is required'],
            enum: ['NGN', 'USD', 'EUR', 'GBP'],
        },
        status: {
            type: String,
            required: [true, 'payment status is required'],
            enum: ['successful', 'pending', 'failed'],
        },
    },
    { timestamps: true }
);

export const WalletTransaction = mongoose.model<WalletITS>('WalletTransaction', walletSchema);


