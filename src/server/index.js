// Empty data object
let projectData = [];

// Express
const express = require("express");
const app = express();

// Body parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors
const cors = require("cors");
app.use(cors());

// Build dist folder
app.use(express.static("dist"));




// Get
app.get("/data", (req, res) => {
  res.send(projectData);
});



// Geonames POST
app.post("/geonames", (req, res) => {
  geonamesData = {
    latitude: req.body.latitude,
    longitude: req.body.longitude,
  };
  projectData.push(geonamesData);
  res.send(projectData);
});



// Weatherbit POST
app.post("/weatherbit", (req, res) => {
  weatherBitData = {
    high: req.body.high,
    low: req.body.low,
    description: req.body.description,
  };
  projectData.push(weatherBitData);
  res.send(projectData);
});



// Pixabay POST
app.post("/pixabay", (req, res) => {
  pixabayData = {
    image: req.body.image,
  };
  projectData.push(pixabayData);
  res.send(projectData);
});

module.exports = app;
