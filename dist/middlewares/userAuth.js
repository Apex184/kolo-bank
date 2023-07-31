"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthorized = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_1 = __importDefault(require("http-status"));
const secret = process.env.JWT_SECRET;
async function isAuthorized(req, res, next) {
    try {
        const token = req.headers.token;
        if (!token) {
            res.status(http_status_1.default.UNAUTHORIZED).json({
                Error: 'Kindly sign in as a User',
            });
            return;
        }
        let verified = jsonwebtoken_1.default.verify(token, secret);
        if (!verified) {
            return res.status(http_status_1.default.UNAUTHORIZED).json({ Error: 'User not verified, you cannot access this route' });
        }
        next();
    }
    catch (error) {
        console.log(error);
        return res.status(http_status_1.default.FORBIDDEN).json({ Error: 'User is not not logged in' });
    }
}
exports.isAuthorized = isAuthorized;
//# sourceMappingURL=userAuth.js.map