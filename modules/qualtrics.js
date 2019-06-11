/**
 * Qualtrics module to interact with Qualtrics survey's data 
 */
module.exports = {
  CreateSurveyDefinition: function (query, callback) {
      return (CreateSurveyDefinition(query, callback))
  },
  GetSurveyDefinition: function (query, callback) {
    return (GetSurveyDefinition(query, callback))
  }
}

const request = require('request')  // HTTP Client

const odata = require('./odata')   // odata manipulation

// ByD custom oData service path
const qualtrics_createservicedef = process.env.QUALTRICS_URL + "/API/v3/survey-definitions"

/**
 * Create Qualtrics Survey Definition through an oData service
 * @param {*} query 
 * @param {*} callback 
 */
function CreateSurveyDefinition(serviceOrderName, callback) {

  var surveyData = {SurveyName: "Survey for Service Order " + serviceOrderName, Language: "EN", ProjectCategory: "CORE"}

  var options = {
      url: qualtrics_createservicedef,
      headers: {
          'x-api-token': process.env.QUALTRICS_TOKEN,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(surveyData)
  }

  request.post(options, function (err, res, body) {
      if (res.statusCode != 200) {
        logError(qualtrics_createservicedef, res, body)
        callback(body, res.statusMessage)
      }
      else {
          callback(null, body);
      }
  });

}

/**
 * GetSurveyDefinition
 * @param {} surveyID  
 * @param {*} callback 
 */
function GetSurveyDefinition(surveyID, callback) {

  var options = {
      url: qualtrics_createservicedef + "/" + surveyID,
      headers: {
          'x-api-token': process.env.QUALTRICS_TOKEN,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      }
  }

  request.get(options, function (err, res, body) {
      if (res.statusCode != 200) {
        logError(qualtrics_createservicedef, res, body)
        callback(res.statusCode, body)
      }
      else {
          callback(null, body);
      }
  });
}

function logError(endpoint, response, body){
  console.error("RESPONSE "+ endpoint + " - " + response.statusCode + " - " + response.statusMessage)
  console.error("BODY " + body)
}