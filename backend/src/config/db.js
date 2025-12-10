import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectDB = async () => {
    const uri = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DB_NAME;

    if (!uri) {
        throw new Error("MONGODB_URI is not defined in environment variables.");
    }

    try {
        await mongoose.connect(uri, {
            dbName: dbName || undefined,
        });
        console.log("MongoDB connection established.");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
};