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

Via HTTP: `git clone https://github.com/luxuo/IFT3225-Infrastructure-de-collecte.git`

### 2. Installer les dépendances

`npm install`

### 3. Configurer les variables d'environnement

Créer le fichier .env et remplir :

```
MONGO_URL=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/?appName=<AppName>
PORT=8383
PHRASE_PASS= <phrase_pass>
```

### 4. Lancer le serveur

`npm start`

Le serveur écoute sur http://localhost:8383

<img width="782" height="342" alt="image" src="https://github.com/user-attachments/assets/c98f18dd-cb34-48ab-9a61-d80d0ab4f07b" />
<img width="776" height="531" alt="image" src="https://github.com/user-attachments/assets/2a8bba3d-51c1-4bbd-8575-1b07f33948a9" />
<img width="637" height="666" alt="image" src="https://github.com/user-attachments/assets/09577d3c-a036-491a-a4e0-315e806b5c05" />

### Lancer les scripts alternatifs

#### bridge.js

Ceci est le script connectant les données de phyphox du téléphone à l'application. 

```
npm run bridge
```

Une série de questions seront posé. Veuillez répondre selon l'information collectée et votre besoin. *Assurez-vous d'avoir un compte. Il va falloir se login en premier*. Le script peut se collecter les données phyphox automatiquement ou manuellement. L'utilisateur sera demandé de quel option il désire.

##### Mode automatique (Phyphox)

- Ouvrir Phyphox sur le téléphone
- Activer l'accès à distance sur Phyphox
- Entrer l'adresse IP affichée par Phyphox quand le script le demande
- Le bridge enregistre pendant quelques secondes et envoie les données automatiquement

##### Mode manuel

Si le téléphone est indisponible ou le réseau non partagé, répondez `o` quand le script vous demande si vous voulez une insertion manuelle.
Le script demande le PATH du fichier et envoie la mesure sans Phyphox.

### seed.js

Ceci est le script qui popule la base de données.

```
npm run seed
```

Une fois exécuté, si aucun message d'ajout de données n'a été fait, ceci est car les données sont déjà dans la base de données.

## Tests avec Postman

### Enpoints de device.js

*Création de device*

```
POST http://localhost:8383/devices
Content-Type: application/json

{
  "username": "monAppareil",
  "password": "motdepasse123",
  "location": "biblio"
}
```

Réponse attendue (201) :

```
{
  "device": { "_id": "...", "username": "monAppareil", "location": "biblio" },
  "authToken": "eyJ..."
}
```

*Pour récupérer le token, comme un login*

```
POST http://localhost:8383/devices/token
Content-Type: application/json

{
  "username": "monAppareil",
  "password": "motdepasse123"
}
```

Réponse attendue (200):

```
{
  "device": { "_id": "...", "username": "monAppareil", "location": "biblio" },
  "authToken": "eyJ..."
}
```

*Pour voir tous les devices*

`GET http://localhost:8383/devices`

Réponse attendue (200):

```
[
  {device},
  ...
]
```

*Pour changer de location ou de mot de passe:*

```
PATCH http://localhost:8383/devices
Content-Type: application/json

{
  "username": "monAppareil",
  "password": "motdepasse123",
  update:{location:"cinema", password:"charlie"}
}
```

Réponse attendue (200):

```
{
  "_id": "...", "username": "monAppareil", "location": "cinema" 
}
```

*Pour supprimer un device*

```
DELETE http://localhost:8383/devices
Content-Type: application/json

{
  "username": "monAppareil",
  "password": "charlie"
}
```

Réponse attendue (204):

` `


### Envoyer une mesure (route protégée par token)

```
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
```

Réponse attendue (201) : 

```{ "measurement": { ... } }```

### Enpoints fonctionnels des mesures (aucun token requis)

`GET /measurements/ambiance/:location` -> 200: `[ {device1}, ... ]`


### Endpoints sémantiques (aucun token requis)

*Heures de pointe*

`GET /measurements/ambiance/:location/busy-hours`

Réponse attendue (200) :

```
{
  "location": "cafe",
  "busyHours": [
    {
      "period": "12:00-13:00",
      "averageAudio": 77,
      "noiseLevel": "modéré"
    },
    {
      "period": "08:00-09:00",
      "averageAudio": 73,
      "noiseLevel": "modéré"
    }
  ],
  "summary": "Les périodes les plus bruyantes sont généralement entre 12:00-13:00 et 08:00-09:00."
}
```

*Recommandation d'étude pour un lieu à un tel jour de la semaine*

`GET /measurements/ambiance/:location/recommendation?type=etude&jour=lundi`

Réponse attendue (200) :

```
{
  "dayOfTheWeek": "lundi",
  "bestTimeForStudy": {
    "period": "18-19",
    "avgNoise": 48
  }
}
```

*Ambiance d'un lieu*

`GET /measurements/:location/:ambiance`

Réponse attendue (200) :

```
{
  "ambiance": "calme",
  "timeFrames": [
    {
      "day": "Lundi",
      "period": "14:00-16:00"
    },
    {
      "day": "Mercredi",
      "period": "17:00-19:00"
    },
    {
      "day": "Lundi",
      "period": "18:00-20:00"
    }
  ]
}
```

*Achallandage d'un lieu*

`GET /measurements/ambiance/:location/crowdedness`

Réponse attendue (200) :

```
{
  "location": "cafe",
  "period": "par heure",
  "crowdedness": [
    {
      "period": "12:00-13:00",
      "averagePeople": 24,
      "crowdedness": "eleve"
    },
    {
      "period": "08:00-09:00",
      "averagePeople": 18,
      "crowdedness": "eleve"
    }
  ],
  "summary": "Les périodes les plus occupées sont généralement entre 12:00-13:00 et 08:00-09:00."
}
```

### Réponses d'erreurs d'authentification

```
401 Probleme de token non existant:
POST http://localhost:8383/measurements
(sans header Authorization)
```

```
401 de token invalide:
POST http://localhost:8383/measurements
Authorization: Bearer tokeninvalide
```

Le code 403 est un code d'erreur qui a vérifié l'identité d'un individu, mais l'individu n'est pas authorisé à accéder la . Voir le 2e paragraphe de [https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/401]



## .env.example

```
MONGO_URL=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/?appName=<AppName>
PORT=8383
PHRASE_PASS=<votre-phrase-secrete-jwt>
```

Afin de préserver la sécurité des mots de passes, un fichier .env complet et fonctionnel se trouve dans le fichier .zip du projet soumis dans studium.