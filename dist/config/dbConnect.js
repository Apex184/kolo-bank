"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Set the global options for Mongoose
mongoose_1.default.set("strictQuery", true);
const dbConnect = () => {
    mongoose_1.default
        .connect(process.env.MONGO_URL)
        .then(() => console.log("DB Connected"))
        .catch((err) => console.log(err));
};
exports.default = dbConnect;
//# sourceMappingURL=dbConnect.js.map