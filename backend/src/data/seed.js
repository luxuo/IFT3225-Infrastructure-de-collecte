const { exit } = require("process");
const Device = require("../models/device");
const Measurement = require("../models/measurement");
const Location = require("../models/location");
const fs = require('fs');
const { connectDB } = require("../../src/services/mongoose");
connectDB().catch(err => console.log(err));


async function seed() {
    // Seed des locations
    const locations = JSON.parse(fs.readFileSync(__dirname + "/location_seed.json"));
    for (element of locations) {
        const exists = await Location.exists({ id: element.id });
        if (!exists) { // assure que l'utilisateur n'existe pas
            const location = new Location(element);
            await location.save();
            console.log("Ajouté location: ", element.name);
        }
    }

    // Seed des devices
    const devices = JSON.parse(fs.readFileSync(__dirname + "/device_seed.json"));
    for (element of devices) {
        const exists = await Device.exists({ username: element.username });
        if (!exists) { // assure que l'utilisateur n'existe pas
            const device = new Device(element);
            try {
                await device.generateAuthTokenAndSaveDevice();
            } catch (e) {
                console.error(e);
            }
            console.log("Ajouté compte: ", device);
        }
    }

    // Seed des mesures
    const measurements = JSON.parse(fs.readFileSync(__dirname + "/measurement_seed.json"));
    for (element of measurements) {
        const exists = await Measurement.exists({ noise_buffer: element.noise_buffer, sound_buffer: element.sound_buffer, location: element.location });
        if (!exists) { // assure que la mesure n'existe pas déjà
            const measurement = new Measurement(element);
            await measurement.save();
            console.log("Mesure ajoutée");
        }
    }
    console.log("Si aucun message d'ajout existe, les données ont déjà été seedé dans la base de données");
    exit();
}

seed();