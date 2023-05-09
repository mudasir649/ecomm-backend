import mongoose from "mongoose";
import validator from "validator";

const UserSchema = new mongoose.Schema({
    image:{
        type: String
    },
    firstName:{
        type: String,
        required: [true, "Please! enter your first name"]
    },
    lastName: {
        type: String,
        required: [true, "Please! enter your last name"]
    },
    userName: {
        type: String,
        unique: true,
        lowercase: true,
        required: [true, "Please! provide a valid email"]
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Please! provide a valid email"]
    },
    accountType:{
        type: String,
        required: [true, "Please! select your account type"]
    },
    password: {
        type: String,
        required: [true, "Please! enter your password"],
        minSelect:8 
    },
    confirmPassword: {
        type: String,
        required: [true, "Please! enter confirm password"],
    }
}, 
    { timestamps: true }
);

const User = mongoose.model('User', UserSchema);

export default User;