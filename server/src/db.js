import mongoose from "mongoose";

export const connectDB = async (uri) => {
    try {
        await mongoose.connect(uri);
        console.log("MongoDB is connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed", error.message);
        process.exit(1);
    }
}