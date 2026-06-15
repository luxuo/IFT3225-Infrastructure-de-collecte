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
router.get("/measurements/ambiance/:location/busy-hours", async (req,res) => {
    const location = req.params.location.trim().toLowerCase();

    const measurement = await Measurement.find({ location });
    
    if (!measurement || measurement.length === 0) {
            return res.status(404).json({ 
                error: `Aucune mesure trouvée pour l'emplacement : '${location}'` 
            });
        }
        

    const hourlyData = Array.from({ length: 24 }, (_, hour) => ({
            hour,
            totalDbSum: 0,
            totalDbCount: 0
        }));

    measurement.forEach(m => {
            const date = new Date(m.timestamp);
            const hour = date.getUTCHours(); 

            if (m.noise_buffer && m.noise_buffer.length > 0) {
                const bufferSum = m.noise_buffer.reduce((sum, val) => sum + val, 0);
                hourlyData[hour].totalDbSum += bufferSum;
                hourlyData[hour].totalDbCount += m.noise_buffer.length;
            }
        });
    
        
    const busyHours = hourlyData
            .filter(item => item.totalDbCount > 0) 
            .map(item => {
                const avgDb = Math.round(item.totalDbSum / item.totalDbCount);

                const startStr = item.hour < 10 ? `0${item.hour}:00` : `${item.hour}:00`;
                const endStr = (item.hour + 1) < 10 ? `0${item.hour + 1}:00` : `${item.hour + 1}:00`;
                

                let noiseLevel = "neutre";
                if (avgDb < 60) noiseLevel = "calme";
                else if (avgDb >= 60 && avgDb < 70) noiseLevel = "moyen";
                else if (avgDb >= 70 && avgDb < 80) noiseLevel = "modéré";
                else if (avgDb >= 80) noiseLevel = "elevé";

                return {
                    period: `${startStr}-${endStr}`,
                    averageAudio: avgDb,
                    noiseLevel: noiseLevel
                };
            })

            .sort((a, b) => b.averageAudio - a.averageAudio)
            .slice(0, 2);


        let summary = "Aucune tendance claire ne se dégage pour le moment.";
        if (busyHours.length > 0) {
            const topPeriods = busyHours.slice(0, 2).map(p => p.period);
            summary = `Les périodes les plus bruyantes sont généralement entre ${topPeriods.join(' et ')}.`;
        }


        return res.status(200).json({
            location,
            busyHours,
            summary
        });

});

module.exports = router;