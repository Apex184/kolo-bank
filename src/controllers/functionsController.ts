import { ObjectId } from "mongoose";
import { Wallet, WalletIT } from "../models/walletShema";
import { WalletTransaction, WalletITS } from "../models/walletTransaction";
import { Transaction, Customer } from "../models/transactionSchema";
import { User, UserInterface } from '../models/userSchema';
import { WalletHistory } from "../models/walletHistory";
import shortid from 'shortid';
import { BankAccount } from '../models/bankAcctSchema';

interface TransactionResult {
    success: boolean;
    messages: string[];
    message?: string;
}


// We are creating wallet automatically
export const createWallet = async (userId: ObjectId): Promise<WalletIT> => {
    try {
        let wallet;

        const checkWallet = await Wallet.findOne({ user: userId });
        if (checkWallet) {
            throw new Error('Wallet already exists.');
        } else {
            wallet = await Wallet.create({
                user: userId,
            });
        }


        return wallet;
    } catch (error) {
        console.log(error);
        throw new Error('Failed to create wallet.');
    }
};


// we are creating bankAccount number for the user automatically
export const createBankAccount = async (userId: ObjectId) => {
    try {
        let accountNumber;
        let isUnique = false;

        while (!isUnique) {
            const randomNumber = Math.floor(1000000000 + Math.random() * 9000000000);
            accountNumber = randomNumber.toString();

            const existingUser = await BankAccount.findOne({ user: userId, accountNumber });
            if (!existingUser) {
                isUnique = true;
            }
        }
        if (!accountNumber) {
            throw new Error('Failed to create account number.');
        }

        return accountNumber;
    } catch (error) {
        console.log(error);
    }
};


// We are creating WalletTransaction to keep the histories from gateway payment
export const createWalletTransaction = async (userId: ObjectId, status: string, currency: string, amount: number) => {
    try {
        const walletTransaction: WalletITS = await WalletTransaction.create({
            userId,
            amount,
            isInflow: true,
            currency,
            status,
        });
        return walletTransaction;
    } catch (error) {
        console.error('Error creating wallet transaction:', error.message);
        throw error;
    }
};

//we are creating transaction history also, just to be sure
export const createTransaction = async (userId: ObjectId, id: string, status: string, currency: string, amount: number, customer: Customer) => {
    try {
        const transaction = await Transaction.create({
            userId,
            transactionId: id,
            customer: {
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
            },
            amount,
            currency,
            paymentStatus: status,
            paymentGateway: "flutterwave",
        });
        return transaction;
    } catch (error) {
        console.log(error);
    }
};


// We are updating user's wallet after transaction
export const updateWallet = async (userId: ObjectId, amount: number) => {
    try {
        const wallet = await Wallet.findOneAndUpdate(
            { user: userId },
            { $inc: { balance: amount } },
            { new: true }
        );
        if (!wallet) throw new Error("User wallet can't be updated");
        return wallet;
    } catch (error) {
        console.log(error);
    }
};

export const getUserWalletById = async (userId: ObjectId) => {
    try {
        const userWallet = await Wallet.findOne({ userId });
        if (!userWallet) {
            throw new Error('Wallet not found.');
        }
        return userWallet;

    } catch (error) {
        console.log(error);
    }
};

//We are sending money from one wallet to another user's wallet.


export const sendMoneyToAnotherWallet = async (user: ObjectId, amount: number, destination: string): Promise<TransactionResult> => {
    const messages: string[] = [];

    try {
        const senderWallet = await getUserWalletById(user);
        if (!senderWallet) {
            messages.push('Sender wallet not found.');
            throw new Error('Sender wallet not found.');
        }
        const receiverAccountNumber = await BankAccount.findOne({ accountNumber: destination });
        if (!receiverAccountNumber) {
            messages.push('Receiver account not found.');
            throw new Error('Receiver account number not found.');
        }
        const receiverWallet = await Wallet.findOne({ user: receiverAccountNumber.user._id });
        if (!receiverWallet) {
            messages.push('Receiver wallet not found.');
            throw new Error('Receiver wallet not found.');
        }

        if (senderWallet.user.toString() === receiverWallet.user.toString()) {
            messages.push('You cannot send money to yourself.');
            throw new Error('You cannot send money to yourself.');
        }

        const senderBalance = senderWallet.balance;

        if (amount > senderBalance) {
            messages.push('Insufficient balance.');
            throw new Error("Insufficient balance");
        }

        senderWallet.balance -= amount;

        receiverWallet.balance += amount;

        await senderWallet.save();
        await receiverWallet.save();

        const transaction = new WalletHistory({
            sender: senderWallet.user,
            receiver: receiverWallet.user,
            amount,
        });
        await transaction.save();

        messages.push('Transaction successful.');
        return { success: true, messages };

    } catch (error) {
        messages.push(error.message);
        console.log(error.message); // Log the error message for debugging purposes
        return { success: false, messages };
    }
};


export const LockedUsersAccount = async (userId: string) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found.');
        }
        if (user.isLocked) {
            throw new Error('User is already locked.');
        }

        user.isLocked = true;
        await user.save();
        return "The user account has been locked successfully";
    } catch (error) {
        console.log(error);
    }
}
export const findAllUsers = async () => {
    try {
        const user = await User.find();
        if (user.length < 1) {
            throw new Error('User not found.');
        }
        return user;
    } catch (error) {
        console.log(error);
    }
}

export const sendBillingPlanToUser = async (user: UserInterface, billingPlan: any) => {
    try {
        const userWallet = await User.findOne({ user: user._id });
        if (!userWallet) {
            throw new Error('Wallet not found.');
        }
        return userWallet;

    } catch (error) {
        console.log(error);
    }
}

