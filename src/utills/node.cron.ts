
import { User } from '../models/userSchema';


export const checkCron = async () => {
    const currentDate = new Date();
    const usersToLock = await User.find({
        verificationSentAt: { $lte: new Date(Date.now() - 5 * 60 * 1000) },
        isVerified: false,
        isLocked: false,
    });

    for (const user of usersToLock) {
        console.log(usersToLock, "Users to lock");
        user.isLocked = true;
        await user.save();
        console.log(`User ${user._id} has been locked due to expired verification link.`);
    }
};
