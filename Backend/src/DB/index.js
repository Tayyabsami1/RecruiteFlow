import mongoose from "mongoose";
import { DB_Name } from "../constants.js"

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_Name}`);
        console.log("Database Connected Success ", `Host ${connectionInstance.connection.host}`);
    }
    catch (err) {
        console.log("Database connection error: ", err);
    }
}


export default connectDB;