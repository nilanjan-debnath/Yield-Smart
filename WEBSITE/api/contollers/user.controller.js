import axios from "axios";

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
