const projectData = [];
const travelPlanner = {};
const express = require('express');
const request = require('request');
const https = require('https');
const util = require('util');
const DarkSky = require('dark-sky');
const moment = require('moment');
const pixabay = require('pixabay-api');
const dotenv = require('dotenv');
dotenv.config();
const PixabayApi = require('node-pixabayclient');
const PixabayPhotos = new PixabayApi({ apiUrl: "https://pixabay.com/api/" });
const app = express();
const bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.use(express.static('dist'));

const port = 8080;

const server = app.listen(port, listening);

function listening(){
    console.log('Server running');
    console.log(`running on localhost: ${port}`);
};


app.get('/user', function(req, res) {
    res.status(200).json({ name: 'Tanveer' });
  });

app.post('/getWeather', async (req, res, next) => {
    const travelPlanner = [];
    let low = '';
    let high = '';
    let latitude = req.body.lat;
    let longitude = req.body.lng;
    let location = req.body.location;
    let departureDate = req.body.date;
    console.log("Departure Date is: " + departureDate);
    var dateLiterals = departureDate.split("/");
    let year = dateLiterals[2];
    let month = dateLiterals[0];
    let day = dateLiterals[1];
    let monthInNum = parseInt(month);
    let properMonth = monthInNum - 1;
    var target = new Date(year, properMonth, day);
    let theTime = year+'-'+monthInNum+'-'+day;
    let apiKey = 'aed79316b7e3ae8325e42b9e357bbb99'
    let proxy = 'https://cors-anywhere.herokuapp.com/';
    let theAppURL = 'https://api.darksky.net/forecast/'+apiKey+'/'+latitude+','+longitude;
    const darksky = new DarkSky(apiKey)
    try {
        const forecast = await darksky
        .options({
            latitude,
            longitude,
            time: theTime 
        })
        .get()
        summary = forecast.currently.summary;
        high = forecast.daily.data[0].temperatureHigh;
        low = forecast.daily.data[0].temperatureLow;
        console.log("Summary is: " + summary);
    }  catch(error) {
        console.log("error", error);
    }

    try {
        var params = {
            key: `14742948-539ebd2455f82f70e0bae3775`,
            q: location, // automatically URL-encoded
            image_type: "photo",
          };

          PixabayPhotos.query(params, function(errors, response, req) {
            if (errors) {
              console.log('One or more errors were encountered:');
              console.log('- ' + errors.join('\n- '));
              return;
            }
            let imgURL = response.hits[0].largeImageURL;
            travelPlanner["image"] = imgURL;
            newEntry = {
                theSummary: summary,
                theLow: low,
                theHigh: high,
                theImage: imgURL,
            }

            projectData.push(newEntry);
            res.send(projectData);
          });
    }  catch(error) {
        console.log("error", error);
    }
})

module.exports = app;