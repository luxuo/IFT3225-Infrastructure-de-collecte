const getMeasurements = require("./src/services/phyphox");
const Data = require("./src/models/data");
const readline = require("readline");
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
async function postData(data){
    const res = await fetch("localhost:"+process.env.PORT+"/measurements", {
        method:"POST",
        body:JSON.stringify(data),
        headers:{
            "Content-type": "application/json; charset=UTF8",
            "x-api-key": process.env.API_KEY
        }
    });
    // TODO handle errors
}

// prendre les attributs manuellement
async function promptAttributes(){
    // TODO Handle errors
    const data = {};
    data.surrounding_people = parseInt(await prompt('Combien de personnes sont autour de l\'outil de mesure?'));
    data.ambiance = await prompt('C\'est quoi l\'ambiance? [calme, social, neutre, bruyant, chaotique]');
    data.source_distance = parseFloat(await prompt('À quelle distance est la source de bruit (en mètre)?'));
    data.weather = await prompt('Quelles sont les conditions météorologiques? [clair, nuageux, brume, precipitante]');
    data.setting = await prompt('Dans quel type d\'environnement est l\'outil de mesure? [transport, restauration, commerce, regroupement, industriel, communautaire, institutionnel, personnel]');
    data.location = await prompt('C\'est quoi le lieu? doit seulement contenir des lettres simples a-z et doit être entre 4 à 20 charactères de long');
    return data;
}

// record and send
async function recordAndSend(){
    const data = await promptAttributes();
    const ip = await prompt('C\'est quoi l\'adresse ip du téléphone? Ex: 192.168.0.67');
    const time_ms = parseInt(await prompt('Pendant combien de secondes voulez-vous faire la mesure?')) * 1000;
    console.log("En train de mesurer... cela va prendre " + (time_ms / 1000) + " secondes");
    const measures = await getMeasurements(ip, time_ms);
    const timestamp = Date.now()
    console.log("Fini de mesurer!");
    data.timestamp = timestamp
    //data.noise_buffer = measures.amplitudes.buffer
    //data.time_buffer = measures.time.buffer
}