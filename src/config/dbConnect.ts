import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// Set the global options for Mongoose
mongoose.set("strictQuery", true);

const dbConnect = () => {
    mongoose
        .connect(process.env.MONGO_URL! as string)
        .then(() => console.log("DB Connected"))
        .catch((err) => console.log(err));
};

export default dbConnect;