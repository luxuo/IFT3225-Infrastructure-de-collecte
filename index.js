require("dotenv").config();
const testRoutes = require("./src/routes/test");
const express = require("express");

const app = express();
const port = process.env.PORT || 8383;

app.use(express.json());
app.use(testRoutes);

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