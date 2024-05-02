import bcryptjs from "bcryptjs";
import UserModel from '../models/user.model.js';
import { errorHandle } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signUp = async(req, res, next) => {
    const {username, email, password} = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new UserModel({username, email, password: hashedPassword});
    try{
        await newUser.save();
        return res.status(200).json("User is created");
    }catch(error){
        next(error);
    }
};

export const signIn = async (req, res, next) => {
    const {email, password} = req.body;
    try{
        const validUser = await UserModel.findOne({email});
        if(!validUser) return next(errorHandle(404, "User not found"));
        const validPasswod = bcryptjs.compareSync(password, validUser.password);
        if(!validPasswod) return next(errorHandle(404, "Wrong Credentials"));
        const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET);
        const {password: pass, ...rest} = validUser._doc;
        res.cookie('access_token', token, {httpOnly: true}).status(200).json(rest);
    }catch(error){
        next(error);
    }
}