"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const walletController_1 = require("../controllers/walletController");
const sendMoneyController_1 = require("../controllers/sendMoneyController");
const userAuth_1 = require("../middlewares/userAuth");
const router = (0, express_1.default)();
router.get('/wallet-balance', userAuth_1.isAuthorized, walletController_1.ViewWalletBalance);
router.post('/send-fund', userAuth_1.isAuthorized, sendMoneyController_1.sendMoney);
exports.default = router;
//# sourceMappingURL=walletRouter.js.map