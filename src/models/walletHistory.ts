// transaction.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface Transaction extends Document {
    sender: mongoose.Types.ObjectId;
    receiver: mongoose.Types.ObjectId;
    amount: number;
    date: Date;

}

const transactionSchema: Schema = new Schema({
    sender: { type: mongoose.Types.ObjectId, ref: 'Wallet', required: true },
    receiver: { type: mongoose.Types.ObjectId, ref: 'Wallet', required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },

});
export const WalletHistory = mongoose.model<Transaction>('WalletHistory', transactionSchema);


