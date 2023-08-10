"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const adminSchema_1 = require("../models/adminSchema");
const http_status_1 = __importDefault(require("http-status"));
// interface jwtPayload {
//     _id: string;
//     role: string;
// }
const secret = process.env.ADMIN_SECRET_KEY;
async function adminAuth(req, res, next) {
    try {
        const token = req.headers.token;
        const verifiedToken = jsonwebtoken_1.default.verify(token, secret);
        const { _id } = verifiedToken;
        const data = await adminSchema_1.Admin.findOne({ _id });
        const adminRoute = (data === null || data === void 0 ? void 0 : data.role) === "admin";
        if (!adminRoute) {
            res.status(http_status_1.default.UNAUTHORIZED).json({
                Error: 'Unauthorised user',
            });
            return;
        }
        next();
    }
    catch (error) {
        console.log(error);
        return res.status(http_status_1.default.FORBIDDEN).json({ Error: 'Admin is not authorised' });
    }
}
exports.adminAuth = adminAuth;
//# sourceMappingURL=adminAuth.js.map