const express = require('express');
const cors = require('cors')
const app = express();
const port = 3001;

// app.use(cors());
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your React app's URL
  credentials: true
}));

const celestialBodies = ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", 
"Neptune","Pluto", "Eris", "Haumea", "Makemake", "Ceres","Moon", "Phobos", "Deimos", "Ganymede", 
"Callisto", "Io", "Europa", "Titan", "Enceladus", "Triton","Sun", "Asteroids", "Comets", 
"Kuiper Belt Objects", "Oort Cloud Objects"];

const GodsRoman = [
  // Major Gods Roman
  "Jupiter", "Juno", "Neptune", "Ceres", "Minerva", "Apollo",
  "Diana", "Mars", "Venus", "Vulcan", "Mercury", "Bacchus",
  "Pluto",
  "Vesta", "Cupid", "Victoria", "Faunus", "Trivia", "Proserpina",
  "Iris", "Somnus", "Mors", "Somnia", "Nemesis", "Juventas",
  "Ganymede", "Lucina", "Antevorta", "Carmenta", "Egeria",
  "Postvorta", "Aglaea", "Euphrosyne", "Thalia", "Nona",
  "Decima", "Morta", "Primavera", "Ver", "Autumnus", "Hiems",
  "Pax", "Aesculapius", "Fortuna", "Concordia", "Libertas",
  "Janus", "Saturn", "Pandora"
];
const GreekGod = [
  "Zeus", "Hera", "Poseidon", "Demeter", "Athena", "Apollo",
  "Artemis", "Ares", "Aphrodite", "Hephaestus", "Hermes",
  "Dionysus", "Hades",
  "Hestia", "Eros", "Nike", "Pan", "Hecate", "Persephone",
  "Iris", "Hypnos", "Thanatos", "Morpheus", "Nemesis", "Hebe",
  "Ganymede", "Eileithyia", "Calliope", "Clio", "Erato",
  "Euterpe", "Melpomene", "Polyhymnia", "Terpsichore", "Thalia",
  "Urania", "Aglaea", "Euphrosyne", "Thalia", "Clotho", "Lachesis",
  "Atropos", "Eunomia", "Dike", "Eirene", "Panacea", "Asclepius",
  "Tyche", "Ananke", "Momus", "Epimetheus", "Atlas", "Pandora"
];

const values = ["Greek%20Gods","Roman%20Gods","Celestial%20Bodies"]
values.map(value => {
  app.get(`/${value}`, (req, res) => {
    switch (value)
    {
    case "Greek%20Gods":
      res.json(GreekGod);
      break;
    case "Roman%20Gods":
      res.json(GodsRoman);
      break;
    case "Celestial%20Bodies":
      res.json(celestialBodies);
      break;
    }
});} )
// app.get('/gods-greek', (req, res) => {
//   res.json(GreekGod);
// });
// app.get('/gods-roman', (req, res) => {
//   res.json(GodsRoman);
// });
// app.get('/celestial_bodies', (req, res) => {
//   res.json(celestialBodies);
// });
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});