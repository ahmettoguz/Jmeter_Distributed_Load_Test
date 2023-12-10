import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDatabase = async (): Promise<void> => {
    try {
        mongoose.set('strictQuery', false);
        if (!process.env.DB_URI)
            throw new Error('DB_URI is not defined in the environment variables');

        await mongoose.connect(process.env.DB_URI);

        console.info('MongoDB connected successfully.');
    } catch (err) {
        console.error('Unable to connect to MongoDB: ', err);
    }
};

export default connectDatabase;
