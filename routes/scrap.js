const path = require('path');
const express = require('express');
const router = express.Router();
const cheerio = require('cheerio');
const fs = require('fs');

const scraping = require('./scrapFunc');


var departure = {
  url: `http://www.bengaluruairport.com/bial/faces/pages/flightInformation/departures.jspx`,
  transform: body => cheerio.load(body)
};

var arrival = {
  url: `http://www.bengaluruairport.com/flightInformation/arrivals.jspx`,
  transform: body => cheerio.load(body)
};

const fileArrival = path.join(path.dirname(process.mainModule.filename), 'arrival.csv');

const fileDeparture = path.join(path.dirname(process.mainModule.filename), 'departure.csv');

//   ROUTES


router.get('/', (req, res, next) => {
  res.sendFile(path.join(path.dirname(process.mainModule.filename), 'views', 'index.html'));
});


router.get('/arrival', function (req, res, next) {
  scraping(arrival, fileArrival).then(data => {
    res.sendFile(path.join(path.dirname(process.mainModule.filename), 'views', 'arrival.html'));
  }).catch(err =>
    console.log(err));
});


// 1. pass arguments to node cmd line without readline library
// 2. can we skip the phsyical file being written on each scrap onto the disk (optional)
// 3. change the CSV data to JSON, instead of view engines, on click of button, display data into the screen (client-side)




router.get('/departure', function (req, res, next) {
  scraping(departure, fileDeparture).then(data => {
    res.sendFile(path.join(path.dirname(process.mainModule.filename), 'views', 'departure.html'));

  }).catch(err =>
    console.log(err));
});


router.get('/data/:spec', function (req, res, next) {
  const name = req.params.spec + '.json';
  const file = path.join(path.dirname(process.mainModule.filename), name);
  fs.readFile(file, (err, data) => {
    if (err) throw err;
    let flightData = JSON.parse(data);
    res.json(flightData);
  });
});


module.exports = router;