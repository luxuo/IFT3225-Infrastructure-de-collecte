require("dotenv").config();
const measurements = require("./src/routes/measurements");
const device = require("./src/routes/device");
const express = require("express");
const { connectDB } = require("./src/services/mongoose");

connectDB().catch(err => console.log(err));

const app = express();
const port = process.env.PORT || 8383;

app.use(express.json());
app.use(measurements);
app.use(device);

app.use((req, res) => {
    return res.status(404).json({
        error: "Route introuvable"
    });
});

app.use((err, req, res, next) => {
    console.error(err);

    return res.status(500).json({
        error: "Erreur interne du serveur"
    });
});

app.listen(port, () => {
    console.log(`Serveur démarré : http://localhost:${port}`);
});