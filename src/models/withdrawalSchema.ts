import mongoose from 'mongoose';

interface Withdraw extends mongoose.Document {
    user: mongoose.Types.ObjectId;
    bankAccount: mongoose.Types.ObjectId;
    amount: Number;
    date: Date;
    WithdrawalStatus: string;


}

const withdrawalSchema = new mongoose.Schema<Withdraw>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    bankAccount: {
        type: mongoose.Schema.Types.ObjectId,
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

export const Withdrawal = mongoose.model<Withdraw>('Withdrawal', withdrawalSchema);

