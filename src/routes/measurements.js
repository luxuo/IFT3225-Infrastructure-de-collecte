const express = require("express");
const Measurement = require("../models/measurement");
const authentification = require("../middleware/authentification")
const router = new express.Router();

// CREATE
router.post("/measurements", authentification, async (req, res) => {
    const data = req.device;
    try {
        await data.save();
        res.status(201).send({ data });
        console.log("Création de la mesure effectuée avec succès !");
    } catch (e) {
        res.status(400).send(e);
    }
});

// GETTTERS
// TODO

module.exports = router;