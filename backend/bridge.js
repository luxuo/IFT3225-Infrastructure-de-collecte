const getMeasurements = require("./src/services/phyphox");
const readline = require("readline");
const csv = require("csv-parser");
const fs = require("fs");
const { exit } = require("process");
require("dotenv").config();

// interface i/o
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const prompt = (prompt) => {
    return new Promise((resolve) => {
        rl.question(prompt, (input) => {
            resolve(input);
        });
    });
};

// post data
async function postData(data, authToken) {
    const res = await fetch("http://localhost:" + process.env.PORT + "/measurements", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": `Bearer ${authToken}`
        }
    });
    console.log(res);
    // TODO handle errors
}

// prendre les attributs manuellement
async function promptAttributes(location) {
    // TODO Handle errors
    const data = {};
    data.surrounding_people = parseInt(await prompt('Combien de personnes sont autour de l\'outil de mesure?:  '));
    data.ambiance = await prompt('C\'est quoi l\'ambiance? [calme, social, neutre, bruyant, chaotique]:  ');
    data.source_distance = parseFloat(await prompt('À quelle distance est la source de bruit (en mètre)?:  '));
    data.weather = await prompt('Quelles sont les conditions météorologiques? [clair, nuageux, brume, precipitante]:  ');
    data.setting = await prompt('Dans quel type d\'environnement est l\'outil de mesure? [transport, restauration, commerce, regroupement, industriel, communautaire, institutionnel, personnel]:  ');
    data.locationId = location;
    const isAtPlace = await prompt(`Êtes-vous à ${location}? (o/n): `);
    if (isAtPlace.toLowerCase() != 'o')
        data.locationId = await prompt('C\'est quoi le lieu? doit seulement contenir des lettres simples a-z et doit être entre 4 à 20 charactères de long:  ');
    return data;
}

// login pour l'authToken
async function promptLogin() {
    const login = {}
    login.username = await prompt("Nom d'utilisateur: ");
    login.password = await prompt("Mot de passe: ");
    const res = await fetch("http://localhost:" + process.env.PORT + "/devices/token", {
        method: "POST",
        body: JSON.stringify(login),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        }
    });
    const body = await res.json();
    return body;
}

// record and send
async function recordAndSend() {

    // login
    const login = await promptLogin();
    const authToken = login.authToken;

    // prendre les données non-mesurable par phyphox
    const data = await promptAttributes(login.device.location);

    // voir si on veut une entrée manuelle des données
    const manualInsertion = await prompt("Voulez-vous insérer manuellement les données? (o/n): ");

    if (manualInsertion.toLowerCase() == 'o') { // entrée manuelle des données

        console.log(`Vous êtes présentement à ${__dirname}`);
        const dir = await prompt("Veuillez compléter le path pour arriver au fichier csv: ");

        dbBuffer = []
        timeBuffer = []
        // fonction de support de lecture
        const append = (line) => {
            if (line['Sound pressure level (dB)'] != '') {
                dbBuffer.push(parseFloat(line['Sound pressure level (dB)']));
                timeBuffer.push(parseFloat(line['Time (s)']));
            }
        };

        // lecture du fichier
        fs.createReadStream(__dirname + dir)
            .pipe(csv())
            .on('data', (data) => append(data))

        // ajoute les données
        data.noise_buffer = dbBuffer;
        data.time_buffer = timeBuffer;

    } else { // entrée automatique

        // prend l'adresse IP du téléphone ayant phyphox
        const ip = await prompt('C\'est quoi l\'adresse ip du téléphone? Ex: 192.168.0.67:  ');
        const time_ms = 20000; //parseInt(await prompt('Pendant combien de secondes voulez-vous faire la mesure?:  ')) * 1000;

        // commence la mesure automatique
        console.log("En train de mesurer... cela va prendre " + (time_ms / 1000) + " secondes");
        const measures = await getMeasurements(ip, time_ms);
        console.log("Fini de mesurer!");

        // ajoute les données
        data.noise_buffer = measures.dB.buffer;
        data.time_buffer = measures.time.buffer;
    }

    // ajoute un timestamp pour les données
    const timestamp = Date.now();
    data.timestamp = timestamp;

    // enregistre les données sur le 
    await postData(data, authToken);

    // sortie du programme
    exit();
}

recordAndSend();