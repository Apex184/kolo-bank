import Joi from 'joi';
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken';
type UserToken = {
    _id: mongoose.Types.ObjectId;
    email: string;
}
type Admin = {
    _id: mongoose.Types.ObjectId;
    email: string;

};

export const userSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    userName: Joi.string().lowercase(),
    email: Joi.string().required(),
    phoneNumber: Joi.string()
        .length(11)
        .pattern(/^[0-9]+$/)
        .required(),
    password: Joi.string()
        .regex(/^[a-zA-Z0-9]{3,30}$/)
        .required(),
    confirmPassword: Joi.ref('password'),
    avatar: Joi.string(),
    isVerified: Joi.boolean().default(false),
}).with('password', 'confirmPassword');

export const loginSchema = Joi.object().keys({
    email: Joi.string().trim().lowercase().required(),
    password: Joi.string()
        .regex(/^[a-zA-Z0-9]{3,30}$/)
        .required(),
});

export const forgotPasswordSchema = Joi.object().keys({
    email: Joi.string().trim().lowercase().required(),
});


// export const generateLoginToken = (user: { [key: string]: unknown }): string => {
export const generateLoginToken = ({ _id, email }: UserToken): string => {
    const pass = process.env.JWT_SECRET as string;
    const user = { _id, email }
    return jwt.sign(user, pass, { expiresIn: '5h' });
    // return jwt.sign(user, pass, { expiresIn: '1d' });
};
export const generateAdminLoginToken = ({ _id, email }: Admin): string => {
    const pass = process.env.ADMIN_SECRET_KEY as string;
    const user = { _id, email }
    return jwt.sign(user, pass, { expiresIn: '5h' });
    // return jwt.sign(user, pass, { expiresIn: '1d' });
};

export const changePasswordSchema = Joi.object()
    .keys({
        password: Joi.string().required(),
        confirmPassword: Joi.any()
            .equal(Joi.ref('password'))
            .required()
            .label('Confirm password')
            .messages({ 'any.only': '{{#label}} does not match' }),
    })
    .with('password', 'confirmPassword');

export const updateUserSchema = Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phoneNumber: Joi.string()
        .length(11)
        .pattern(/^[0-9]+$/)
        .required(),
    avatar: Joi.string(),
});

export const createBankAccountSchema = Joi.object({
    bankName: Joi.string().required(),
    accountName: Joi.string().required(),
    accountNumber: Joi.string()
        .length(10)
        .pattern(/^[0-9]+$/)
        .required(),
    wallet: Joi.number().default(0),
});

export const transferAirtimeSchema = Joi.object({
    network: Joi.string().required(),
    phoneNumber: Joi.string()
        .length(11)
        .pattern(/^[0-9]+$/)
        .required(),
    amountTransfered: Joi.number().min(100).required(),
    destinationPhoneNumber: Joi.string()
        .length(11)
        .pattern(/^[0-9]+$/)
        .required()
});
export const withdrawalHistorySchema = Joi.object({
    bankName: Joi.string().required(),
    accountNumber: Joi.string()
        .length(10)
        .pattern(/^[0-9]+$/)
        .required(),
    amount: Joi.number().required(),
    status: Joi.string(),
});

export const walletSchema = Joi.object({
    completed: Joi.boolean().required(),
    amount: Joi.when('completed', { is: Joi.boolean().valid(true), then: Joi.number().required(), otherwise: Joi.valid(null) }),
    email: Joi.when('completed', { is: Joi.boolean().valid(true), then: Joi.string().email().required(), otherwise: Joi.valid(null) }),
    transactionId: Joi.string().required(),
})

export const options = {
    abortEarly: false,
    errors: {
        wrap: {
            label: '',
        },
    },
};
