import mongoose from 'mongoose';
import User from '../models/user.js';
import dbConnect from '../config/database.js';

const updateExistingUsers = async () => {
    try {
        await dbConnect();
        const result = await User.updateMany(
            { isActive: { $ne: true } },
            { $set: { isActive: true } }
        );
        console.log(`Updated ${result.modifiedCount} users to set isActive: true`);
        process.exit(0);
    } catch (error) {
        console.error('Error updating users:', error);
        process.exit(1);
    }
};

updateExistingUsers();
