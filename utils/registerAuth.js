import bcrypt from "bcrypt";

export const decryptedPassword = async(password, userPassword) => {
    return await bcrypt.compare(password, userPassword)
    
}

export const encryptedPassword = async(password) => {
    
    let encryptedPassword = await bcrypt.hash(password, 10);

    return encryptedPassword;
}