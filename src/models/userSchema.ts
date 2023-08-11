import mongoose from 'mongoose';


// const AccountTypesEnum = Object.freeze({
//     SAVINGS: 'savings',
//     CURRENT: 'current',
//     FIXED_DEPOSIT: 'fixed_deposit',
// });
// const AccountTypesEnum = {
//     SAVINGS: 'savings',
//     CURRENT: 'current',
//     FIXED_DEPOSIT: 'fixed_deposit',
// };

export type Bvn = {
    bvn: string;

};

interface BankAccount {
    _id: mongoose.Types.ObjectId;
    accountNumber?: string;

}


interface Wallet {
    _id: mongoose.Types.ObjectId;
    balance: string;
    currency: string;
    walletStatus: string;
    lastFunded: string;

}

export interface UserInterface extends mongoose.Document {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: Date;
    username: string;
    password: string;
    verificationSentAt: Date;
    isBvnVerified: Boolean;
    address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    accountType: string;
    isVerified: Boolean;
    isLocked: Boolean;
    bvn: Bvn;
    bankAccounts: mongoose.Types.ObjectId | BankAccount;
    wallet: mongoose.Types.ObjectId | Wallet;
    role?: 'user' | 'admin';
}

const userSchema = new mongoose.Schema<UserInterface>({
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
    verificationSentAt: {
        type: Date,
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
    bankAccounts:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BankAccount',

    },
    wallet: {
        type: mongoose.Schema.Types.ObjectId,
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

export const User = mongoose.model<UserInterface>('User', userSchema);

