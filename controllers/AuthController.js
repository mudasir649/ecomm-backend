import jwt from "jsonwebtoken"
import User from "../models/UserModel.js";
import bcrypt from "bcrypt"
import { successResponse, failedResponse } from "../utils/response.js";
import { decryptedPassword } from "../utils/registerAuth.js";

// create jwt
const signedToken = async(userId, email, accountType) => {
    return jwt.sign(
        { userId, email, accountType }, 
        process.env.JWT_SECRET, 
        { expiresIn: process.env.JWT_EXPIRES_IN});
}


const sendJwtToken = async(userId, email, accountType, req, res) => {
    const token = await signedToken(userId, email, accountType);
    res.cookie('jwt', token, {expires: new Date(Date.now() + 120000000), httpOnly: true});
};

// user registration api
const register = (async(req, res) => {

    const { firstName, lastName, userName, email, accountType, password, confirmPassword } = req.body;
    let encryptedPassword, existingEmail, existingUsername;

    try {

        existingEmail = await User.findOne({email});
        existingUsername = await User.findOne({userName});

        // check if input fields are empty
        if(!firstName || !lastName || !userName || !email || !accountType || !password || !confirmPassword){
            return failedResponse(
                res, 
                "Please! enter all input fields to register",
                false
                )
        }
        // if check for exiting email
        else if(existingEmail){
            return failedResponse(
                res,
                "Email with this name already exists. Please! try with the new email", 
                false);
        }
        else if(existingUsername){
            return failedResponse(
                res,
                "Username with this name already exists. Please! try with the new username", 
                false);
        }
        // check if password and confirm password are not same. if both are same then encrypting password
        else if(confirmPassword !== password){
            return failedResponse(res, "Password and confirm password are not same.", false);
        }
        else{
            encryptedPassword = await bcrypt.hash(password, 10);
        }
        
        //after all if conditions are checked then create new user
        let user = await User.create({
                    firstName, lastName, userName, email, 
                    accountType, password: encryptedPassword, confirmPassword: encryptedPassword});

        if(user){
            await sendJwtToken(user._id, user.email, user.accountType, req, res);
        }

        return successResponse(
            res, 
            "User is created successfully.",
            true,
            user
            )

    } catch {
        return failedResponse(
            res,
            "Failed to create user! Please try again",
            false)
    }
});

const login = (async (req, res) => {
    const { email, password } = req.body;

    try {

        const user = await User.findOne({ email });
        // check if user or password not correct
        if(!user || !(await decryptedPassword(password, user.password))){
            return failedResponse(res, "Incorrect! email or password please try again.", false);
        }else{
            await sendJwtToken(user._id, user.email, user.accountType, req, res);
        }

        return successResponse(
            res,
            "You are loggedin.",
            true
            )

    } catch {
        return failedResponse(
            res,
            "User not exists.",
            false
        )
    }
});

const secret = async(req, res) => {
    try {
        let token = req.cookies.jwt;
        const verfiedToken = jwt.verify(token, process.env.JWT_SECRET);
        return successResponse(res, "Verified token is sent in secret successfully.", true, verfiedToken);
    } catch (error) {
        return failedResponse(res, "No token exists.")
    }
}

const logout = async(req, res) => {
    try {
        const rs = res.clearCookie('jwt');
        return successResponse(
            res,
            "Your are logged out successfully.",
            true
        )
    } catch (error) {
        return failedResponse(
            res,
            "Unable to log out. Please! try again.",
            false
            )
    }
}

export {
    register,
    login,
    logout,
    secret
}