const express = require('express');
const app = express();
const port = 3000;
const celestialBodies = {
  planets: ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"],
  dwarf_planets: ["Pluto", "Eris", "Haumea", "Makemake", "Ceres"],
  moons: ["Moon", "Phobos", "Deimos", "Ganymede", "Callisto", "Io", "Europa", "Titan", "Enceladus", "Triton"],
  other_celestial_bodies: ["Sun", "Asteroids", "Comets", "Kuiper Belt Objects", "Oort Cloud Objects"]
};
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
const values = ["gods-greek,gods-roman,celestial_bodies"]
values.map(value => {
  app.get(`/${value}`, (req, res) => {
    switch (value)
    {
    case "gods-greek":
      res.json(GreekGod);
      break;
    case "gods-roman":
      res.json(GodsRoman);
      break;
    case "celestial_bodies":
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