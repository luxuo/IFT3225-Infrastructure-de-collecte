const express = require("express");
const Data = require("../models/data");
const router = new express.Router();

// CREATE
router.post("/measurements", async (req, res) => {
    // TODO handle authentication
    const data = new Data(req.body);
    try {
        await data.save();
        res.status(201).send({ data });
        console.log("Création de la mesure effectuée avec succès !");
    } catch (e) {
        res.status(400).send(e);
    }
});

module.exports = router;