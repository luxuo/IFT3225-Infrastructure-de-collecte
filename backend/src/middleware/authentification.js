require("dotenv").config();
const jwt = require("jsonwebtoken");
const Device = require("../models/device");

const authentification = async (req, res, next) => {
    try{
        const authToken = req.header("Authorization").replace("Bearer ", "");
        const decodedToken = jwt.verify(authToken, process.env.PHRASE_PASS);
        const device = await Device.findOne({_id: decodedToken._id, "authToken":authToken})

        if (!device){
            throw new Error("Token invalide");
        }
        req.authToken = authToken;
        req.device = device;
        next();
    }catch (err){
        res.status(401).send("Device Non-Authentifié");
    }
};

module.exports = authentification;
