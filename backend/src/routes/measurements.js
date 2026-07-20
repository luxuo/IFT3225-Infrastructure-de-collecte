const express = require("express");
const Device = require('../models/device');
const Measurement = require("../models/measurement");
const Location = require("../models/location");
const authentification = require("../middleware/authentification")
const router = new express.Router();


// Prends les données collectées
async function getData(ip){
    const res = await fetch("http://"+ ip + ":8080/get?calibration=&dB=full&time=full");
    const data = await res.json();
    return data['buffer'];
}

// Fonction d'attente
function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}


// CREATE
router.post("/measurements", authentification, async (req, res) => {
    const measurement = new Measurement(req.body);
    try {
        const location = await Location.exists(req.body.locationId);
        console.log(location)
        await measurement.save();
        res.status(201).send({ measurement });
        console.log("Création de la mesure effectuée avec succès !");
    } catch (e) {
        res.status(400).send(e);
    }
});

// CREATE
router.post("/phyphox/measurements", authentification, async (req, res) => {
    try {
        const ip = req.body.ip;
        await fetch("http://"+ ip + ":8080/control?cmd=clear");
        await fetch("http://"+ ip + ":8080/control?cmd=start");
        await sleep(10000);
        await fetch("http://"+ ip + ":8080/control?cmd=stop");
        const data = await getData(ip);

        delete req.body.ip
        const measurementData = req.body
        measurementData.noise_buffer = data.dB.buffer;
        measurementData.time_buffer = data.time.buffer;

        measurementData.timestamp = new Date();
        measurementData.author = req.device.username;

        const measurement = new Measurement(req.body);

        try {
            const location = await Location.exists({locationId:req.body.locationId});
            await measurement.save();
            res.status(201).send({ measurement });
            console.log("Création de la mesure effectuée avec succès !");
        } catch (e) {
            console.log(e);
            res.status(400).send(e);
        }
    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
});

// ENDPOINTS DE RESSOURCE
router.get("/measurements/:locationId", async (req, res) => {
    const locationId = req.params.locationId.trim().toLowerCase();
    const measurements = await Measurement.find({ locationId });

    if (!measurements || measurements.length === 0) { // pas de mesures
        return res.status(404).json({
            error: `Aucune mesure trouvée pour l'emplacement : '${locationId}'`
        });
    }
    res.send({ locationId, measurements });
});

// ENDPOINTS SÉMANTIQUE

// Get les heures d'achallandage
router.get("/measurements/:locationId/busy-hours", async (req, res) => {
    const locationId = req.params.locationId.trim().toLowerCase();
    const measurement = await Measurement.find({ locationId });

    if (!measurement || measurement.length === 0) { // pas de mesures
        return res.status(404).json({
            error: `Aucune mesure trouvée pour l'emplacement : '${locationId}'`
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
        locationId,
        busyHours,
        summary
    });

});

// get le niveau de densité de population selon l'heure
router.get("/measurements/:locationId/crowdedness", async (req, res) => {
    try {
        const locationId = req.params.locationId.trim().toLowerCase();

        const measurements = await Measurement.find({ locationId });

        if (!measurements || measurements.length === 0) {
            return res.status(404).json({
                error: `Aucune mesure trouvée pour l'emplacement : '${locationId}'`
            });
        }

        const hourlyData = Array.from({ length: 24 }, (_, hour) => ({
            hour,
            totalPeopleSum: 0,
            totalPeopleCount: 0
        }));

        measurements.forEach(m => {
            const date = new Date(m.timestamp);

            if (Number.isNaN(date.getTime())) {
                return;
            }

            const hour = date.getUTCHours();
            const peopleCount = Number(m.surrounding_people);

            if (!Number.isNaN(peopleCount) && peopleCount >= 0) {
                hourlyData[hour].totalPeopleSum += peopleCount;
                hourlyData[hour].totalPeopleCount += 1;
            }
        });

        const crowdedHours = hourlyData
            .filter(item => item.totalPeopleCount > 0)
            .map(item => {
                const averagePeople = Math.round(item.totalPeopleSum / item.totalPeopleCount);

                const startStr = item.hour < 10 ? `0${item.hour}:00` : `${item.hour}:00`;
                const endHour = item.hour + 1;
                const endStr = endHour < 10 ? `0${endHour}:00` : `${endHour}:00`;

                let crowdedness = "vide";

                if (averagePeople === 0) {
                    crowdedness = "vide";
                } else if (averagePeople < 7) {
                    crowdedness = "faible";
                } else if (averagePeople < 14) {
                    crowdedness = "moyen";
                } else {
                    crowdedness = "eleve";
                }

                return {
                    period: `${startStr}-${endStr}`,
                    averagePeople,
                    crowdedness
                };
            })
            .sort((a, b) => b.averagePeople - a.averagePeople)
            .slice(0, 2);

        if (crowdedHours.length === 0) {
            return res.status(200).json({
                locationId,
                period: "par heure",
                crowdedness: [],
                summary: "Pas assez de données sur l'achalandage pour identifier les périodes les plus occupées."
            });
        }

        const topPeriods = crowdedHours.map(p => p.period);

        return res.status(200).json({
            locationId,
            period: "par heure",
            crowdedness: crowdedHours,
            summary: `Les périodes les plus occupées sont généralement entre ${topPeriods.join(" et ")}.`
        });

    } catch (e) {
        console.error(e);

        return res.status(500).json({
            error: "Erreur lors du calcul de l'achalandage."
        });
    }
});

// Get l'heure de recommandation pour l'étude pour la journée
// /measurements/:locationId/recommendation?type=study&jour=lundi
router.get("/measurements/:locationId/recommendation", async (req, res) => {
    try {
        const locationId = req.params.locationId.trim().toLowerCase();
        if (req.query.type != "etude" && req.query.type != "study") {
            return res.status(400).send({ error: "Type de requête pas supportée. Veuillez utiliser ?type=etude&jour={votre jour de choix}" });
        }
        const journee = req.query.jour.trim().toLowerCase();




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


        const measurements = await Measurement.find({ locationId });

        if (!measurements || measurements.length === 0) {
            return res.status(404).json({
                error: `Aucune donnée trouvée pour l'emplacement : '${locationId}'`
            });
        }


        const dayMeasurements = measurements.filter(m => {
            const date = new Date(m.timestamp);
            return date.getUTCDay() === jourChoisi;
        });

        if (dayMeasurements.length === 0) {
            return res.status(404).json({
                error: `Aucune donnée trouvée pour '${locationId}' le '${journee}'`
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

router.get("/measurements/:locationId/:ambiance", async (req, res) => {
    try {
        const locationId = req.params.locationId.trim().toLowerCase();
        const targetAmbiance = req.params.ambiance.trim().toLowerCase();

        const allowedAmbiances = ['calme', 'bruyant', 'social', 'excitant'];
        if (!allowedAmbiances.includes(targetAmbiance)) {
            return res.status(400).json({
                error: `Ambiance invalide. Doit être l'un de: ${allowedAmbiances.join(', ')}`
            });
        }

        const measurements = await Measurement.find({
            locationId: locationId,
            ambiance: targetAmbiance
        });

        if (!measurements || measurements.length === 0) {
            return res.status(404).json({
                error: `Aucune donnée d'ambiance '${targetAmbiance}' trouvée pour '${locationId}'`
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
