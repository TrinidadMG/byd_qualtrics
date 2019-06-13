console.log("app starting...");
/* Load NodeJS Modules */
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const redis = require("redis");  // redis service to keep login cookies

var app = express();
app.use(express.static('public'));

/* Load Local Modules */
var byd = require('./modules/erp/byd');
var qualtrics = require('./modules/qualtrics');

//To Support body on post requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configure Redis 
console.log("Configuring redis")
var credentials = null;
var vcap = null;
if (process.env.VCAP_SERVICES) {
    credentials = {}
    vcap = JSON.parse(process.env.VCAP_SERVICES);
    credentials = vcap['redis'][0].credentials;
    credentials.host = credentials.hostname
    console.log("Redis credentials found in VCAP")
};
var redisClient = redis.createClient(credentials);
redisClient.on('connect', function () {
    console.log("Connected to Redis")
    byd.setRedisClient(redisClient)
});

// Create Qualtrics Survey
app.post('/CreateQualtricsSurvey', function (req, res) {

    console.log(req.body)

    byd.GetServiceOrder(req.body.ServiceOrderID, function (err, resp) {
        if (err) {
            res.status(500).send("GetServiceOrder ERROR " + resp)
        } else {
            qualtrics.CreateSurveyDefinition(resp.value.Name, function (errQ, respQ) {
                if (errQ) {
                    res.status(500).send("CreateSurveyDefinition ERROR " + respQ)
                } else {
                    console.dir(respQ);
                    res.status(200).send(respQ)
                }
            });            
        }
    });
    
    console.log('CreateQualtricsSurvey')
});

// Get Qualtrics Survey Definition
app.get('/GetSurveyDef', function (req, res) {
    qualtrics.GetSurveyDefinition(req.body.SurveyID, function (errQ, respQ) {
        if (errQ) {
            res.status(500).send("GetSurveyDefinition ERROR " + respQ)
        } else {
            console.dir(respQ);
            res.status(200).send(respQ)
        }
    });            
});


var port = process.env.PORT || 30000
app.listen(port, function () {
    console.log('ByD Qualtrics app listening on port ' + port);
});