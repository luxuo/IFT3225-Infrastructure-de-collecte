// Prends les données collectées
async function getData(ip){
    const res = await fetch("http://"+ ip + ":8080/get?calibration=&dB=full&time=full");
    const data = await res.json();
    return data['buffer'];
}

// Vide toutes la cache de données enregistrée par l'expérience, arrête aussi l'enregistrage
async function resetData(ip){
    const res = await fetch("http://"+ ip + ":8080/control?cmd=clear");
    const data = await res.json();
}

// Commence l'enregistrement
async function startRecording(ip){
    const res = await fetch("http://"+ ip + ":8080/control?cmd=start");
    const data = await res.json();
}

// Arrête l'enregistrement
async function stopRecording(ip){
    const res = await fetch("http://"+ ip + ":8080/control?cmd=stop");
    const data = await res.json();
}

// Fonction d'attente
function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Fonction d'enregistrement
export default async function recordNewData(ip, timeout_millis){
    await resetData(ip);
    await startRecording(ip);
    await sleep(timeout_millis);
    await stopRecording(ip);
    return await getData(ip);
}
