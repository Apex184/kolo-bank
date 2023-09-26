import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { Admin } from "../models/adminSchema";
import httpStatus from 'http-status';
// interface jwtPayload {
//     _id: string;
//     role: string;
// }
const secret = process.env.ADMIN_SECRET_KEY as string;
type AllowedRoles = 'admin';
type jwtPayload = {
    _id: mongoose.Types.ObjectId;
    role: AllowedRoles;

};

export async function adminAuth(req: Request | any, res: Response, next: NextFunction) {
    try {
        const token = req.headers.token as string;
        const verifiedToken = jwt.verify(token, secret) as jwtPayload;
        const { _id } = verifiedToken
        const data = await Admin.findOne({ _id });
        const adminRoute = data?.role === "admin";
        if (!adminRoute) {

            res.status(httpStatus.UNAUTHORIZED).json({
                Error: 'Unauthorised user',
            });
            return;
        }
        next();
    } catch (error) {
        console.log(error);
        return res.status(httpStatus.FORBIDDEN).json({ Error: 'Admin is not authorised' });
    }
}






