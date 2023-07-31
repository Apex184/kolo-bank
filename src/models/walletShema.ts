import mongoose from 'mongoose';

export interface WalletIT extends mongoose.Document {
    user: mongoose.Types.ObjectId;
    balance: Number;
    currency: string;
    walletStatus: string;
    lastFunded: Date;

}

const walletSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
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


export const Wallet = mongoose.model('Wallet', walletSchema);

