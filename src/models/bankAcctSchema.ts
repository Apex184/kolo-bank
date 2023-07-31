import mongoose from 'mongoose';

interface BankAccount extends mongoose.Document {
    user: mongoose.Types.ObjectId;
    accountNumber?: string;
    userWalletId: mongoose.Types.ObjectId;
    balance: number;
}

const bankAcctSchema = new mongoose.Schema<BankAccount>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    userWalletId: {
        type: mongoose.Schema.Types.ObjectId,
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

export const BankAccount = mongoose.model<BankAccount>('BankAccount', bankAcctSchema);

