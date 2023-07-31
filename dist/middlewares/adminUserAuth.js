"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdminAuthorized = exports.isAuthorized = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_1 = __importDefault(require("http-status"));
const secret = process.env.ADMIN_SECRET_KEY;
async function isAuthorized(req, res, next, requiredRoles) {
    try {
        const authHeader = req.headers.authorization || req.headers.Authorization;
        if (!authHeader) {
            res.status(http_status_1.default.UNAUTHORIZED).json({
                Error: 'Kindly sign in',
            });
            return;
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            res.status(http_status_1.default.UNAUTHORIZED).json({
                Error: 'Invalid data',
            });
            return;
        }
        const verified = jsonwebtoken_1.default.verify(token, secret);
        if (!verified) {
            return res.status(http_status_1.default.UNAUTHORIZED).json({ Error: 'User not verified, you cannot access this route' });
        }
        const { id, role } = verified;
        req.user = id;
        if (requiredRoles.includes(role)) {
            next();
        }
        else {
            return res.status(http_status_1.default.FORBIDDEN).json({ Error: 'You are not a valid user' });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(http_status_1.default.UNAUTHORIZED).json({ Error: 'User is not logged in' });
    }
}
exports.isAuthorized = isAuthorized;
async function isAdminAuthorized(req, res, next) {
    try {
        let requiredRoles = "admin";
        const token = req.headers.token;
        if (!token) {
            res.status(http_status_1.default.UNAUTHORIZED).json({
                Error: 'Kindly sign in as an admin',
            });
            return;
        }
        let verified = jsonwebtoken_1.default.verify(token, secret);
        const { id, role } = verified;
        req.user = id;
        if (requiredRoles.includes(role)) {
            next();
        }
        else {
            return res.status(http_status_1.default.FORBIDDEN).json({ Error: 'You are not an admin' });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(http_status_1.default.FORBIDDEN).json({ Error: 'Admin is not not logged in' });
    }
}
exports.isAdminAuthorized = isAdminAuthorized;
//# sourceMappingURL=adminUserAuth.js.map