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

// ENDPOINTS DE RESSOURCE
router.get("/measurements/:location", async (req,res) => {
    const location = req.params.location.trim().toLowerCase();
    const measurements = await Measurement.find({ location });

    if (!measurements || measurements.length === 0) { // pas de mesures
        return res.status(404).json({
            error: `Aucune mesure trouvée pour l'emplacement : '${location}'`
        });
    }
    res.send({location,measurements});
});

// ENDPOINTS SÉMANTIQUE

// Get les heures d'achallandage
router.get("/measurements/:location/busy-hours", async (req, res) => {
    const location = req.params.location.trim().toLowerCase();
    const measurement = await Measurement.find({ location });

    if (!measurement || measurement.length === 0) { // pas de mesures
        return res.status(404).json({
            error: `Aucune mesure trouvée pour l'emplacement : '${location}'`
        });
    }

    // 
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

// Get l'heure de recommandation pour l'étude pour la journée
// /measurements/:location/recommendation?type=study&jour=lundi
router.get("/measurements/:location/recommendation", async (req, res) => {
    try {
        const location = req.params.location.trim().toLowerCase();
        const journee = req.query.jour.trim().toLowerCase();

        if (req.query.type.toLowerCase() != "etude" && req.query.type.toLowerCase() != "study"){
            return res.status(400).send({error: "type de requête pas supportée. Types supportés: type=etude ou type=study]"});
        }


        const joursSemaine = {
            "dimanche": 0,
            "lundi": 1,
            "mardi": 2,
            "mercredi": 3,
            "jeudi": 4,
            "vendredi": 5,
            "samedi": 6
        };

        if (joursSemaine[journee] === undefined) {
            return res.status(400).json({ error: "Journée invalide. Utilisez: lundi, mardi, etc." });
        }

        const jourChoisi = joursSemaine[journee];


        const measurements = await Measurement.find({ location });

        if (!measurements || measurements.length === 0) {
            return res.status(404).json({
                error: `Aucune donnée trouvée pour l'emplacement : '${location}'`
            });
        }


        const dayMeasurements = measurements.filter(m => {
            const date = new Date(m.timestamp);
            return date.getUTCDay() === jourChoisi;
        });

        if (dayMeasurements.length === 0) {
            return res.status(404).json({
                error: `Aucune donnée trouvée pour '${location}' le '${journee}'`
            });
        }

        const hourlyData = Array.from({ length: 24 }, (_, hour) => ({
            hour,
            totalDbSum: 0,
            totalDbCount: 0
        }));

        // additionner la somme des decibels pour chaque heure
        dayMeasurements.forEach(m => {
            const date = new Date(m.timestamp);
            const hour = date.getUTCHours();

            if (m.noise_buffer && m.noise_buffer.length > 0) {
                const bufferSum = m.noise_buffer.reduce((sum, val) => sum + val, 0);
                hourlyData[hour].totalDbSum += bufferSum;
                hourlyData[hour].totalDbCount += m.noise_buffer.length;
            }
        });

        // moyenne la plus basse
        let bestHour = null;
        let minAvgNoise = Infinity;

        hourlyData.forEach(item => {
            if (item.totalDbCount > 0) {
                const avgDb = Math.round(item.totalDbSum / item.totalDbCount);
                if (avgDb < minAvgNoise) {
                    minAvgNoise = avgDb;
                    bestHour = item.hour;
                }
            }
        });


        return res.status(200).json({
            dayOfTheWeek: journee,
            bestTimeForStudy: {
                period: `${bestHour}-${bestHour + 1}`,
                avgNoise: minAvgNoise
            }
        });

    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Erreur" });
    }
});

router.get("/measurements/:location/:ambiance", async (req, res) => {
    try {
        const location = req.params.location.trim().toLowerCase();
        const targetAmbiance = req.params.ambiance.trim().toLowerCase();

        const allowedAmbiances = ['calme', 'bruyant', 'social', 'excitant'];
        if (!allowedAmbiances.includes(targetAmbiance)) {
            return res.status(400).json({
                error: `Ambiance invalide. Doit être l'un de: ${allowedAmbiances.join(', ')}`
            });
        }

        const measurements = await Measurement.find({
            location: location,
            ambiance: targetAmbiance
        });

        if (!measurements || measurements.length === 0) {
            return res.status(404).json({
                error: `Aucune donnée d'ambiance '${targetAmbiance}' trouvée pour '${location}'`
            });
        }

        const dayNames = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

        const frequencyStats = {};

        // on compte les fréquence ou un certaine ambiance arrive le plus souvent
        // pour un créneau horaire.
        measurements.forEach(m => {
            const date = new Date(m.timestamp);
            const dayIdx = date.getUTCDay();
            const hour = date.getUTCHours();

            const key = `${dayIdx}-${hour}`;

            if (!frequencyStats[key]) {
                frequencyStats[key] = {
                    day: dayNames[dayIdx],
                    hour: hour,
                    count: 0
                };
            }

            frequencyStats[key].count += 1;
        });

        const topTimeFrames = Object.values(frequencyStats)
            .sort((a, b) => b.count - a.count)
            .slice(0, 3)
            .map(item => {
                // Format
                const startStr = item.hour < 10 ? `0${item.hour}:00` : `${item.hour}:00`;

                const endHour = (item.hour + 2) % 24;
                const endStr = endHour < 10 ? `0${endHour}:00` : `${endHour}:00`;

                return {
                    day: item.day,
                    period: `${startStr}-${endStr}`
                };
            });

        return res.status(200).json({
            ambiance: targetAmbiance,
            timeFrames: topTimeFrames
        });

    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Erreur de serveur interne" });
    }
});

module.exports = router;