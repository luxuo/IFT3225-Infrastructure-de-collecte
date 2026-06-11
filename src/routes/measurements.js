const express = require("express");
const Measurement = require("../models/measurement");
const authentification = require("../middleware/authentification")
const router = new express.Router();

// CREATE
router.post("/measurements", authentification, async (req, res) => {
    const measurement = new Measurement(req.body);
    try {
        await measurement.save();
        res.status(201).send({ measurement });
        console.log("Création de la mesure effectuée avec succès !");
    } catch (e) {
        res.status(400).send(e);
    }
});

// GETTTERS
// TODO

module.exports = router;