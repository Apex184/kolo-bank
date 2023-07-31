"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewAllUsers = exports.LoginAdmin = exports.RegisterAdmin = void 0;
const http_status_1 = __importDefault(require("http-status"));
const userSchema_1 = require("../models/userSchema");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const validations_1 = require("../utills/validations");
const helperFunctions_1 = require("../utills/helperFunctions");
const adminSchema_1 = require("../models/adminSchema");
const jwtsecret = process.env.ADMIN_SECRET_KEY;
const fromUser = process.env.FROM;
const RegisterAdmin = async (req, res) => {
    const registrationData = req.body;
    try {
        const duplicateEmail = await adminSchema_1.Admin.findOne({ email: req.body.email });
        if (duplicateEmail) {
            return (0, helperFunctions_1.errorResponse)(res, 'Email already exists', http_status_1.default.CONFLICT);
        }
        const duplicatePhoneNumber = await adminSchema_1.Admin.findOne({
            phoneNumber: req.body.phoneNumber
        });
        if (duplicatePhoneNumber) {
            return (0, helperFunctions_1.errorResponse)(res, 'Phone number already exists', http_status_1.default.CONFLICT);
        }
        const duplicateUserName = await adminSchema_1.Admin.findOne({
            username: req.body.username
        });
        if (duplicateUserName) {
            return (0, helperFunctions_1.errorResponse)(res, 'Username already exists', http_status_1.default.CONFLICT);
        }
        const { email } = req.body;
        const hashPassword = await bcryptjs_1.default.hash(req.body.password, 10);
        const user = await adminSchema_1.Admin.create({
            ...registrationData,
            password: hashPassword,
        });
        res.status(http_status_1.default.CREATED).json({
            message: 'User created successfully',
            data: {
                user,
            },
        });
    }
    catch (error) {
        console.error(error);
        return (0, helperFunctions_1.serverError)(res);
    }
};
exports.RegisterAdmin = RegisterAdmin;
const LoginAdmin = async (req, res) => {
    try {
        const user = await adminSchema_1.Admin.findOne({ email: req.body.email });
        if (!user) {
            return (0, helperFunctions_1.errorResponse)(res, 'Incorrect credentials', http_status_1.default.BAD_REQUEST);
        }
        const validUser = await bcryptjs_1.default.compare(req.body.password, user.password);
        if (!validUser) {
            return (0, helperFunctions_1.errorResponse)(res, 'Incorrect credentials', http_status_1.default.BAD_REQUEST);
        }
        const { _id, email } = user;
        const token = (0, validations_1.generateAdminLoginToken)({ _id: user._id, email: email });
        if (validUser) {
            return (0, helperFunctions_1.successResponseLogin)(res, 'Login successfully', http_status_1.default.OK, user, token);
        }
    }
    catch (error) {
        console.log(error);
        return (0, helperFunctions_1.serverError)(res);
    }
};
exports.LoginAdmin = LoginAdmin;
const ViewAllUsers = async (req, res) => {
    try {
        const users = await userSchema_1.User.find({ isVerified: true });
        if (!users) {
            return (0, helperFunctions_1.errorResponse)(res, 'No user found', http_status_1.default.NOT_FOUND);
        }
        return (0, helperFunctions_1.successResponse)(res, 'Users fetched successfully', http_status_1.default.OK, users);
    }
    catch (error) {
        console.log(error);
        return (0, helperFunctions_1.serverError)(res);
    }
};
exports.ViewAllUsers = ViewAllUsers;
//# sourceMappingURL=adminController.js.map