import mongoose from "mongoose";

export const dbConnection = async () => {
    try {
        mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser:true,
            useUnifiedTopology: true,
        }).then(() => console.log("database connected successfully!"));
        mongoose.set('strictQuery', false);
    } catch (error) {
        console.log(error);
    }
}