# IFT3225-Infrastructure-de-collecte

Serveur Express connecté à MongoDB Atlas qui collecte des données d'ambiance
telles que niveau sonore ou météo avec l'aide de l'application Phyphox et les rend
interrogeables via une API REST. Les données sont captées par une application téléphonique,
acheminées par un bridge Node.js, et analysées par des
endpoints sémantiques qui répondent à des questions concrètes sur l'ambiance et l'evironnement
d'un lieu.

## Prérequis

- Node.js v18+
- Compte MongoDB Atlas
- Application Phyphox installée sur un téléphone 
- Le téléphone et l'ordinateur doivent être sur le même réseau Wi-Fi local

## Le guide de l'installation

### 1. cloner le repertoire Github

### 2. Installer les dépendances

{content: npm install}

### 3. Configurer les variables d'environnement

Copier le fichier d'exemple et remplir les valeurs :

cp .env.example .env

Ouvrir .env et remplir :

MONGO_URL=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/?appName=<AppName>
PORT=8383
PHRASE_PASS= <phrase_pass>

### 4. Lancer le serveur

npm start

Le serveur écoute sur http://localhost:8383

<img width="782" height="342" alt="image" src="https://github.com/user-attachments/assets/c98f18dd-cb34-48ab-9a61-d80d0ab4f07b" />
<img width="776" height="531" alt="image" src="https://github.com/user-attachments/assets/2a8bba3d-51c1-4bbd-8575-1b07f33948a9" />
<img width="783" height="546" alt="image" src="https://github.com/user-attachments/assets/e9b82aa5-494d-4dbd-a94a-ee2d6ac45367" />

## Tests avec Postman

### Étape 1 — Créer un appareil et récupérer un token

POST http://localhost:8383/devices
Content-Type: application/json

{
  "username": "monAppareil",
  "password": "motdepasse123",
  "location": "biblio"
}

Réponse attendue (201) :
{
  "device": { "_id": "...", "username": "monAppareil", "location": "biblio" },
  "authToken": "eyJ..."
}

Copier la valeur de authToken pour les étapes suivantes.

### Étape 2 — Envoyer une mesure (route protégée)

POST http://localhost:8383/measurements
Content-Type: application/json
Authorization: Bearer <authToken>

{
  "noise_buffer": [42.1, 43.5, 41.8, 44.2, 40.9],
  "time_buffer": [0.0, 0.5, 1.0, 1.5, 2.0],
  "timestamp": "2026-06-15T14:30:00.000Z",
  "surrounding_people": 5,
  "ambiance": "neutre",
  "source_distance": 3.5,
  "weather": "clair",
  "setting": "institutionnel",
  "location": "biblio"
}

Réponse attendue (201) : { "measurement": { ... } }

### Étape 3 — Tester les endpoints sémantiques (aucun token requis)

GET /measurements/ambiance/:location/busy-hours
GET /measurements/ambiance/:location/recommendation/:journee
GET /measurements/ambiance/:location/recommendation/horaire/:ambiance

### Étape 4 — Tester les erreurs d'authentification

401 Probleme de token
POST http://localhost:8383/measurements
(sans header Authorization)
