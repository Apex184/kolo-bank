
import mongoose, { Document, Schema, Model } from 'mongoose';

export type Customer = {
    name: string;
    email: string;
    phone: string;
};

export interface ITransaction extends Document {
    userId: mongoose.Types.ObjectId;
    transactionId: number;
    customer: Customer;
    amount: number;
    currency: 'NGN' | 'USD' | 'EUR' | 'GBP';
    paymentStatus: 'successful' | 'pending' | 'failed';
    paymentGateway: 'flutterwave';
    createdAt?: Date;
    updatedAt?: Date;
}

const transactionSchema: Schema<ITransaction> = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        transactionId: {
            type: Number,
            trim: true,
        },
        customer: {
            type: {
                name: {
                    type: String,
                    required: [true, 'name is required'],
                    trim: true,
                },
                email: {
                    type: String,
                    required: [true, 'email is required'],
                    trim: true,
                },
                phone: {
                    type: String,
                },
            },
            required: [true, 'customer information is required'],
        },
        amount: {
            type: Number,
            required: [true, 'amount is required'],
        },
        currency: {
            type: String,
            required: [true, 'currency is required'],
            enum: ['NGN', 'USD', 'EUR', 'GBP'],
        },
        paymentStatus: {
            type: String,
            enum: ['successful', 'pending', 'failed'],
            default: 'pending',
        },
        paymentGateway: {
            type: String,
            required: [true, 'payment gateway is required'],
            enum: ['flutterwave'],
        },
    },
    {
        timestamps: true,
    }
);

export const Transaction: Model<ITransaction> = mongoose.model<ITransaction>('Transaction', transactionSchema);
