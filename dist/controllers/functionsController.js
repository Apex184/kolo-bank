"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LockedUsersAccount = exports.sendMoneyToAnotherWallet = exports.getUserWalletById = exports.updateWallet = exports.createTransaction = exports.createWalletTransaction = exports.createBankAccount = exports.createWallet = void 0;
const walletShema_1 = require("../models/walletShema");
const walletTransaction_1 = require("../models/walletTransaction");
const transactionSchema_1 = require("../models/transactionSchema");
const userSchema_1 = require("../models/userSchema");
const walletHistory_1 = require("../models/walletHistory");
const bankAcctSchema_1 = require("../models/bankAcctSchema");
// We are creating wallet automatically
const createWallet = async (userId) => {
    try {
        let wallet;
        const checkWallet = await walletShema_1.Wallet.findOne({ user: userId });
        if (checkWallet) {
            throw new Error('Wallet already exists.');
        }
        else {
            wallet = await walletShema_1.Wallet.create({
                user: userId,
            });
        }
        return wallet;
    }
    catch (error) {
        console.log(error);
        throw new Error('Failed to create wallet.');
    }
};
exports.createWallet = createWallet;
// we are creating bankAccount number for the user automatically
const createBankAccount = async (userId) => {
    try {
        let accountNumber;
        let isUnique = false;
        while (!isUnique) {
            const randomNumber = Math.floor(1000000000 + Math.random() * 9000000000);
            accountNumber = randomNumber.toString();
            const existingUser = await bankAcctSchema_1.BankAccount.findOne({ user: userId, accountNumber });
            if (!existingUser) {
                isUnique = true;
            }
        }
        if (!accountNumber) {
            throw new Error('Failed to create account number.');
        }
        return accountNumber;
    }
    catch (error) {
        console.log(error);
    }
};
exports.createBankAccount = createBankAccount;
// We are creating WalletTransaction to keep the histories from gateway payment
const createWalletTransaction = async (userId, status, currency, amount) => {
    try {
        const walletTransaction = await walletTransaction_1.WalletTransaction.create({
            userId,
            amount,
            isInflow: true,
            currency,
            status,
        });
        return walletTransaction;
    }
    catch (error) {
        console.error('Error creating wallet transaction:', error.message);
        throw error;
    }
};
exports.createWalletTransaction = createWalletTransaction;
//we are creating transaction history also, just to be sure
const createTransaction = async (userId, id, status, currency, amount, customer) => {
    try {
        const transaction = await transactionSchema_1.Transaction.create({
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
    }
    catch (error) {
        console.log(error);
    }
};
exports.createTransaction = createTransaction;
// We are updating user's wallet after transaction
const updateWallet = async (userId, amount) => {
    try {
        const wallet = await walletShema_1.Wallet.findOneAndUpdate({ user: userId }, { $inc: { balance: amount } }, { new: true });
        if (!wallet)
            throw new Error("User wallet can't be updated");
        return wallet;
    }
    catch (error) {
        console.log(error);
    }
};
exports.updateWallet = updateWallet;
const getUserWalletById = async (userId) => {
    try {
        const userWallet = await walletShema_1.Wallet.findOne({ userId });
        if (!userWallet) {
            throw new Error('Wallet not found.');
        }
        return userWallet;
    }
    catch (error) {
        console.log(error);
    }
};
exports.getUserWalletById = getUserWalletById;
//We are sending money from one wallet to another user's wallet.
const sendMoneyToAnotherWallet = async (user, amount, destination) => {
    const messages = [];
    try {
        const senderWallet = await (0, exports.getUserWalletById)(user);
        if (!senderWallet) {
            messages.push('Sender wallet not found.');
            throw new Error('Sender wallet not found.');
        }
        const receiverAccountNumber = await bankAcctSchema_1.BankAccount.findOne({ accountNumber: destination });
        if (!receiverAccountNumber) {
            messages.push('Receiver account not found.');
            throw new Error('Receiver account number not found.');
        }
        const receiverWallet = await walletShema_1.Wallet.findOne({ user: receiverAccountNumber.user._id });
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
        const transaction = new walletHistory_1.WalletHistory({
            sender: senderWallet.user,
            receiver: receiverWallet.user,
            amount,
        });
        await transaction.save();
        messages.push('Transaction successful.');
        return { success: true, messages };
    }
    catch (error) {
        messages.push(error.message);
        console.log(error.message); // Log the error message for debugging purposes
        return { success: false, messages };
    }
};
exports.sendMoneyToAnotherWallet = sendMoneyToAnotherWallet;
const LockedUsersAccount = async (userId) => {
    try {
        const user = await userSchema_1.User.findById(userId);
        if (!user) {
            throw new Error('User not found.');
        }
        user.isLocked = true;
        await user.save();
        return user;
    }
    catch (error) {
        console.log(error);
    }
};
exports.LockedUsersAccount = LockedUsersAccount;
//# sourceMappingURL=functionsController.js.map