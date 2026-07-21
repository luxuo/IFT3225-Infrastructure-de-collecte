# IFT3225-Infrastructure-de-collecte

Application React qui affiche et collecte des données d'ambiance. Utilise un serveur Express connecté à MongoDB Atlas. La page web affiche une map à l'aide de Leaflet où on peut voir les lieux. Quand on clique sur un lieu on peut voir son ambiance et d'autres informations. Les utilisateur peuvent s'authentifier,créer un compte, enregistrer des lieux favoris et soummettre des nouvelles mesures d'ambiance de lieu. Afin de faire un mesure on utilise un bridge Node.js qui est connecté à une application Phyphox sur un téléphone qui va effectuer la mesure.

L'application est divisé en deux partie: backend et frontend. Il faut que le serveur express est actif dans le backend et l'application react est active dans le frontend.

## Prérequis

- Node.js v18+
- Compte MongoDB Atlas
- Application Phyphox installée sur un téléphone 
- Le téléphone et l'ordinateur doivent être sur le même réseau Wi-Fi local

## Le guide de l'installation

### 1. cloner le repertoire Github

Via HTTP: `git clone https://github.com/luxuo/IFT3225-Infrastructure-de-collecte.git`

### 2. Installer les dépendances

`cd backend`
`npm install`
`cd frontend/vite-project`
`npm install`

### 3. Configurer les variables d'environnement

Créer le fichier backend/.env et remplir :

```
MONGO_URL=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/?appName=<AppName>
PORT=8383
PHRASE_PASS= <phrase_pass>
```

### 4. Lancer le serveur Express

`cd backend`
`npm start`


### 5. Lancer l'application React

Dans un autre terminal

`cd frontend/vite-project`
`npm run dev`

### 6. Accéder au site web

Dans un browser mettre http://localhost:5173

## Utilisation du site web

En ouvrant le site web, on arrive a la page principal qui affiche la liste des lieux. On peut cliquer sur un lieu et on arrive à la vue détaillé de ce lieu. On peut voir un graph d'historique de mesures et d'autres informations. Aussi, on a une étoile à coté du nom du lieu. Si on est connecté, on peut cliquer cette étoile, et le lieu va être ajouté au favoris de ce user. 

L'entête a des boutons qui permette d'accéder différentes pages. Si on est authentifié le bouton "Se connecter" devient un accès à la page compte (le bouton affiche le nom d'utilisateur). En allant sur la page compte, on peut voir nos favoris.

On peut cliquer sur le bouton soumettre une mesure qui va nous permettre de soumettre une mesure. Si on est pas authentifié ça va nous amener à la page de connexion. Pour faire un enregistrement il va falloir utiliser l'application phyphox sur notre téléphone.



## Readme de la Phase 1


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

**Création de device**

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

**Pour récupérer le token, comme un login**

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

**Pour voir tous les devices**

`GET http://localhost:8383/devices`

Réponse attendue (200):

```
[
  {device},
  ...
]
```

**Pour changer de location ou de mot de passe:**

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

**Pour supprimer un device**

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

**Mesures d'un lieu**

`GET /measurements/:location` 

Réponse attendue (200): 

```
{
  location:"cafe"
  measurements:[
    {mesure1},
    ...
  ]
}
```


### Endpoints sémantiques (aucun token requis)

**Heures de pointe**

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

**Recommandation d'étude pour un lieu à un tel jour de la semaine**

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

**Ambiance d'un lieu**

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

**Achallandage d'un lieu**

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