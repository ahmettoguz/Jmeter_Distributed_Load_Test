import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (): Promise<void> => {
    try {
        mongoose.set('strictQuery', false);
        if (!process.env.DB_URI)
            throw new Error('DB_URI is not defined in the environment variables');

        await mongoose.connect(process.env.DB_URI);

        console.info('MongoDB Connected');
    } catch (err) {
        console.error(err);
        throw new Error('Unable to connect to MongoDB');
    }
};

export default connectDB;
