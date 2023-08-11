"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUser = exports.verifyUser = exports.RegisterUser = void 0;
const http_status_1 = __importDefault(require("http-status"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validations_1 = require("../utills/validations");
const helperFunctions_1 = require("../utills/helperFunctions");
const sendMail_1 = __importDefault(require("../mailers/sendMail"));
const mailTemplate_1 = require("../mailers/mailTemplate");
const userSchema_1 = require("../models/userSchema");
const functionsController_1 = require("../controllers/functionsController");
const bankAcctSchema_1 = require("../models/bankAcctSchema");
const jwtsecret = process.env.JWT_SECRET;
const fromUser = process.env.FROM;
const RegisterUser = async (req, res) => {
    const registrationData = req.body;
    try {
        const duplicateEmail = await userSchema_1.User.findOne({ email: req.body.email });
        if (duplicateEmail) {
            return (0, helperFunctions_1.errorResponse)(res, 'Email already exists', http_status_1.default.CONFLICT);
        }
        const duplicatePhoneNumber = await userSchema_1.User.findOne({
            phoneNumber: req.body.phoneNumber
        });
        if (duplicatePhoneNumber) {
            return (0, helperFunctions_1.errorResponse)(res, 'Phone number already exists', http_status_1.default.CONFLICT);
        }
        const duplicateUserName = await userSchema_1.User.findOne({
            username: req.body.username
        });
        if (duplicateUserName) {
            return (0, helperFunctions_1.errorResponse)(res, 'Username already exists', http_status_1.default.CONFLICT);
        }
        const { email } = req.body;
        const hashPassword = await bcryptjs_1.default.hash(req.body.password, 10);
        const user = await userSchema_1.User.create({
            ...registrationData,
            password: hashPassword,
        });
        await (0, functionsController_1.createWallet)(user._id);
        const accountNumber = await (0, functionsController_1.createBankAccount)(user._id);
        await bankAcctSchema_1.BankAccount.create({
            user: user._id,
            accountNumber,
        });
        const token = (0, validations_1.generateLoginToken)({ _id: user._id, email: email });
        if (user) {
            user.verificationSentAt = new Date(); // Set the verificationSentAt field to the current timestamp
            const expirationTime = new Date(user.verificationSentAt.getTime() + 5 * 60 * 1000); // 5 minutes in milliseconds
            const currentTime = new Date();
            const timeRemaining = expirationTime > currentTime ? expirationTime.getTime() - currentTime.getTime() : 0;
            const html = (0, mailTemplate_1.emailVerificationView)(token, timeRemaining);
            await sendMail_1.default.sendEmail(fromUser, req.body.email, 'Please verify your email', html);
            await user.save(); // Save the updated user document
        }
        res.status(http_status_1.default.CREATED).json({
            message: 'User created successfully',
            data: {
                user,
                token,
            },
        });
    }
    catch (error) {
        console.error(error);
        return (0, helperFunctions_1.serverError)(res); // You should define the serverError function to send a proper error response
    }
};
exports.RegisterUser = RegisterUser;
async function verifyUser(req, res, next) {
    try {
        const token = req.params.token;
        try {
            const { email, _id } = jsonwebtoken_1.default.verify(token, jwtsecret);
            if (!email) {
                return (0, helperFunctions_1.errorResponse)(res, "Verification failed: Email not found in token", http_status_1.default.BAD_REQUEST);
            }
            const user = await userSchema_1.User.findOne({ email: email });
            if (user === null || user === void 0 ? void 0 : user.isLocked) {
                return (0, helperFunctions_1.errorResponse)(res, "Verification failed: User is locked, contact our support team", http_status_1.default.BAD_REQUEST);
            }
            if (!user) {
                return (0, helperFunctions_1.errorResponse)(res, "Verification failed: User not found", http_status_1.default.NOT_FOUND);
            }
            if (user.isVerified) {
                return (0, helperFunctions_1.errorResponse)(res, "Email is already verified", http_status_1.default.CONFLICT);
            }
            const updated = await userSchema_1.User.findOneAndUpdate({ email: email }, { $set: { isVerified: true } }, { new: true });
            return (0, helperFunctions_1.successResponse)(res, "Email verified successfully", http_status_1.default.OK, updated);
        }
        catch (error) {
            console.error(error);
            return (0, helperFunctions_1.errorResponse)(res, "Verification failed: Invalid or expired token", http_status_1.default.BAD_REQUEST);
        }
    }
    catch (error) {
        console.log(error);
        return (0, helperFunctions_1.serverError)(res);
    }
}
exports.verifyUser = verifyUser;
const LoginUser = async (req, res) => {
    try {
        const user = await userSchema_1.User.findOne({ email: req.body.email });
        if (!user) {
            return (0, helperFunctions_1.errorResponse)(res, 'Incorrect credentials', http_status_1.default.BAD_REQUEST);
        }
        if (user === null || user === void 0 ? void 0 : user.isLocked) {
            return (0, helperFunctions_1.errorResponse)(res, "Verification failed: User is locked, contact our support team", http_status_1.default.BAD_REQUEST);
        }
        const validUser = await bcryptjs_1.default.compare(req.body.password, user.password);
        if (!validUser) {
            return (0, helperFunctions_1.errorResponse)(res, 'Incorrect credentials', http_status_1.default.BAD_REQUEST);
        }
        const { id, email } = user;
        const token = (0, validations_1.generateLoginToken)({ _id: user._id, email: email });
        if (!user.isVerified) {
            return (0, helperFunctions_1.errorResponse)(res, 'Kindly verify your email', http_status_1.default.UNAUTHORIZED);
        }
        if (validUser) {
            return (0, helperFunctions_1.successResponseLogin)(res, 'Login successfully', http_status_1.default.OK, user, token);
        }
    }
    catch (error) {
        console.log(error);
        return (0, helperFunctions_1.serverError)(res);
    }
};
exports.LoginUser = LoginUser;
//# sourceMappingURL=userController.js.map