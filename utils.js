import mongoose from "mongoose";

export async function connectToDB() {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
    } catch (err) {
        throw new Error(`Error while connecting to db - ${err}`);
    }
}
