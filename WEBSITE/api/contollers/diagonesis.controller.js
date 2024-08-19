import axios from "axios";
export const imgOutput = async (req, res, next) => {
    try {

        const response = await axios.post("https://yield-smart-agent.onrender.com/image/", {
            image: req.body.image
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
}