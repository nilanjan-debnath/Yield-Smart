import axios from "axios";
import bcryptjs from "bcryptjs";
import userModel from "../models/user.model.js";

export const test = async (req, res, next) => {
    return res.status(200).json("this is a test route");
}

export const output = async (req, res, next) => {
    try {

        const response = await axios.post("https://yield-smart-agent.onrender.com/groot-ai/", {
            id: req.body.id,
            index: req.body.index
        }, {
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json'
            }
        });
        res.status(200).json(response.data);
    } catch (error) {
        next(error);
    }
};

export const readToken = async (req, res) => {
    return res.status(200).json(req.user);
};

export const updateUser = async (req, res, next) => {
    if (req.user._id !== req.params.userId) {
        return res.status(401).json("You can only update your profile");
    }

    try {
        if(req.body.password){
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }

        const updateUser = await userModel.findByIdAndUpdate(
            req.params.userId,
            {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    avatar: req.body.avatar
                },
            },
            {new: true},
        );

        const {password, ...rest} = updateUser._doc;
        res.status(200).json(rest);
    }
    catch (error) {
        next(error);
    }
}