import mongoose from 'mongoose';

export interface AdminIT extends mongoose.Document {
    // Basic User Information
    name: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: Date;
    username: string;
    password: string;
    role: 'admin';
}


const adminSchema = new mongoose.Schema<AdminIT>({
    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },

    role: {
        type: String,
        default: 'admin',
    },

});

export const Admin = mongoose.model<AdminIT>('Admin', adminSchema);
// module.exports = Admin;
