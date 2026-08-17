import mongoose from "mongoose";

const connectDB = async () => {
    // Serverless functions (Vercel) can reuse a warm instance across invocations —
    // if we're already connected, skip reconnecting instead of opening a new
    // connection every time and exhausting MongoDB's connection limit.
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");
        return conn;
    }
    catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};
export default connectDB;