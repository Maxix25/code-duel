import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI =
    process.env.MONGODB_URI || 'mongodb://localhost:27017/code_duel';

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('MongoDB Connected successfully');

        mongoose.connection.on('error', (err: Error) => {
            console.error(`MongoDB connection error: ${err}`);
            process.exit(1);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected.');
        });
    } catch (error) {
        console.error(
            `Error connecting to MongoDB: ${error instanceof Error ? error.message : error}`
        );
        process.exit(1);
    }
};

export default connectDB;
