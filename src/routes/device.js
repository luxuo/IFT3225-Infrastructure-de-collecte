const express = require("express");
const Device = require("../models/device");
const authentification = require("../middleware/authentification")
const router = new express.Router();

// CREATE
router.post("/devices", async (req, res) => {
    const device = new Device(req.body);
    try {
        const authToken = await device.generateAuthTokenAndSaveDevice();
        res.status(201).send({ device, authToken });
        console.log("Création de user device effectuée avec succès !");
    } catch (err) {
        res.status(400).send(err);
    }
});

// GET DEVICES
router.get("/devices", async (req,res) =>{
    try{
        const devices = await Device.find({});
        res.send(devices);
    }catch (err){
        res.status(500).send(err);
    }
});

// GET TOKEN
router.get("/devices/token", async (req,res) => {
    try{
        const device = await Device.findDevice(req.body.username, req.body.password);
        res.send({device, authToken:device.authToken});
    }catch (err){
        res.status(400).send(err);
    }

});

// UPDATE
router.patch("/devices", async (req,res) => {
    const allowedUpdates = ["location", "password"];
    const requestedUpdates = Object.keys(req.body.update);
    const isValidOperation = requestedUpdates.every(update => allowedUpdates.includes(update));
    if (!isValidOperation){
        return res.status(400).send({error: "Tentative de modification de champs non autorisés"});
    }
    try{
        const device = await Device.findDevice(req.body.username, req.body.password);
        try{
            requestedUpdates.forEach(update => {
                device[update] = req.body.update[update];
            })
            await device.save();
            res.send(device);
        }catch(err){
            res.status(500).send(err);
        }
    }catch(err){
        res.status(400).send(err);
    }

});

// DELETE
router.delete("/devices", async (req, res) =>{
    try{
        const device = await Device.findDevice(req.body.username, req.body.password);
        try{
            await device.deleteOne();
            res.send(device);
            console.log("Suppression d'utilisateur effectué avec succès");
        }catch (err){
            res.status(500).send(err);
        }
    }catch(err){
        res.status(401).send(err);
    }
});


module.exports = router;