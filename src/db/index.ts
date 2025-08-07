import { env } from "@/config/env"
import mongoose from "mongoose"

const connectDB = async () => {
    try {
        await mongoose.connect(env.MONGO_URI)
        console.log("MongoDB connected successfully")

    } catch (error) {
        console.log("MongoDB connection failed", error)
        process.exit()
    }
}

export default connectDB

