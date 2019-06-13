

// ByD custom oData service path from Hackathon samples
// https://github.com/B1SA/hackathon/tree/master/ByDBackend
// https://github.com/SAP/sapbydesign-api-samples/blob/master/End-to-End%20Scenarios/Custom%20OData%20Service/tmserviceorder.xml




function CreateSurveyFromServiceOrder(serviceOrderID, callback) {
  var options = {}

  // Get Service Order Name from ByDesign via OData
  options = {
    url = "https://{0}.sap.com//sap/byd/odata/cust/v1/tmserviceorder/ServiceOrderCollection('{1}')?$format=json".format(bydtenantname, bydserviceorderid),
    method = "GET",
    headers: {
      "x-csrf-token": bydCsrfToken,
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": "Basic " + bydAuthToken
    },
  }
  request(options, function (error, response, bydRespBody) {
    if (error) {
      callback(error);
    } else {
        
      // Create a Survey in Qualtrics
      options = {
        url: "https://{0}.qualtrics.com/API/v3/survey-definitions".format(qualtricsDataCenter),
        headers: {
          'x-api-token': qualtricsAPIToken,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({SurveyName: "Survey for Service Order " + bydRespBody.d.results.Name, Language: "EN", ProjectCategory: "CORE"})
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
  });
}