"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const flutter_1 = require("../controllers/flutter");
const userAuth_1 = require("../middlewares/userAuth");
const router = (0, express_1.default)();
router.post('/fund-account', userAuth_1.isAuthorized, flutter_1.createPayments);
router.get('/verify-transaction', flutter_1.responses);
exports.default = router;
//# sourceMappingURL=flutterWaveRoute.js.map