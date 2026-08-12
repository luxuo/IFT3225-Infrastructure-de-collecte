function crowdednessLevel(averagePeople) {
    let crowdedness = "vide";

    if (typeof averagePeople !== "number" || averagePeople < 0 ) {
        throw new Error("Invalid input: averagePeople must be a positive number");
    } 

    if (averagePeople === 0) {
        crowdedness = "vide";
    } else if (averagePeople < 7) {
        crowdedness = "faible";
    } else if (averagePeople < 14) {
        crowdedness = "moyen";
    } else {
        crowdedness = "eleve";
    }
    return crowdedness;
}

function classmentAmbiance(avgDb){
    let noiseLevel = "neutre";

    // check if avgdb is valid (i want a summer vacation please just let me pass this class AAAAAAAAAAAAAAAAAAAAAAAAAAAAHHH)
    if (typeof avgDb !== "number" || avgDb < 0) {
        throw new Error("Invalid input: avgDb must be a positive number");
    }

    if (avgDb < 60) noiseLevel = "calme";
    else if (avgDb >= 60 && avgDb < 70) noiseLevel = "moyen";
    else if (avgDb >= 70 && avgDb < 80) noiseLevel = "modéré";
    else if (avgDb >= 80) noiseLevel = "elevé";

    return noiseLevel;
}

// la fonction verifie si les mesures sont la, ou valide en general. highly reused
function dataVerification(measurement) {
    const checkPass = false;
    if (measurement && measurement.length > 0) { 
        checkPass = true;
    }
    return checkPass;
}

function dailyAudio(measurements) {
    const hourlyData = Array.from({ length: 24 }, (_, hour) => ({
            hour,
            totalDbSum: 0,
            totalDbCount: 0
        }));

    measurements.forEach(m => {
        const date = new Date(m.timestamp);
        const hour = date.getUTCHours();

        if (m.noise_buffer && m.noise_buffer.length > 0) {
            const bufferSum = m.noise_buffer.reduce((sum, val) => sum + val, 0);
            hourlyData[hour].totalDbSum += bufferSum;
            hourlyData[hour].totalDbCount += m.noise_buffer.length;
        }
    });
    return hourlyData;
}

module.exports = {
  crowdednessLevel,
  classmentAmbiance,
  dataVerification,
  dailyAudio
};