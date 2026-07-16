const express = require("express");
const authentification = require("../middleware/authentification");
const Location = require("../models/location");
const router = new express.Router();

// CREATE
router.post("/locations", authentification, async (req, res) => {
    const location = new Location(req.body);
    try {
        await location.save();
        res.status(201).send({ location });
        console.log("Création de lieu effectuée avec succès !");
    } catch (err) {
        res.status(400).send(err);
    }
});

// GET LOCAIONS
router.get("/locations", async (req,res) =>{
    try{
        const locations = await Location.find({});
        res.send(locations);
    }catch (err){
        res.status(500).send(err);
    }
});

// UPDATE
router.patch("/locations", authentification, async (req,res) => {
    const allowedUpdates = ["lon", "lat"];
    const requestedUpdates = Object.keys(req.body.update);
    const isValidOperation = requestedUpdates.every(update => allowedUpdates.includes(update));
    if (!isValidOperation){
        return res.status(400).send({error: "Tentative de modification de champs non autorisés"});
    }
    try{
        const location = await Location.findOne(req.body.id);
        try{
            requestedUpdates.forEach(update => {
                location[update] = req.body.update[update];
            })
            await location.save();
            res.send(location);
        }catch(err){
            res.status(500).send(err);
        }
    }catch(err){
        res.status(400).send(err);
    }

});

module.exports = router;