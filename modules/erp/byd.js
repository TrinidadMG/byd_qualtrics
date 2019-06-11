/**
 * SAP Business ByDesign module to interact with ByDesign Data 
 * Server Configuration and User Credentials set in the Cloud Foundry associated ByD Destination and modules/dest/dest-app.json file 
 */
module.exports = {
    GetServiceOrder: function (query, callback) {
        return (GetServiceOrder(query, callback))
    },
    setRedisClient: function (inClient) { redisClient = inClient; } // set redis client
}


const request = require('request')  // HTTP Client
const moment = require('moment')    // Date Time manipulation

const odata = require('../odata')   // odata manipulation

//Hash Keys for Redis DB
const hash_Session = "byd_SessionID"
const hash_csrf = "byd_CSRF"

// Load internal Destination module 
const Route = require("../dest/Destination");

// ByD custom oData service path from Hackathon samples
// https://github.com/B1SA/hackathon/tree/master/ByDBackend
// https://github.com/SAP/sapbydesign-api-samples/blob/master/End-to-End%20Scenarios/Custom%20OData%20Service/tmserviceorder.xml
const model_serviceorder = "/tmserviceorder/ServiceOrderCollection"

// Load ByD route and destination
var bydRoute = null;
var bydDest = null;
Route.getRoute("ByD").then(r => {
    bydRoute = r;
    console.log("bydRoute " + bydRoute.target.name);

    // Load ByD destination
    bydRoute.getDestination().then(dest => {
        console.log(dest);
        bydDest = dest;
    });
});

/**
 * Handle BydRequests
 * @param {*} options 
 * @param {*} callback 
 */
function ByDRequest(options, callback) {

    getCookiesCache(options.method).then(function (cookies) {
        if (options.headers == null) { options.headers = [] }

        options.headers["Cookie"] = cookies

        getTokenCache(options.method).then(function (csrfToken) {

            options.headers["x-csrf-token"] = csrfToken
            options.headers["Accept"] = "application/json"
            options.headers["Content-Type"] = "application/json"
            options.headers["Authorization"] = "Basic " + bydDest.authTokens[0].value
            console.log("Preparing BYD Request:" + JSON.stringify(options))

            request(options, function (error, response, body) {
                if (error) {
                    console.error("ByDRequest " + error.message)
                    callback(error, error.message);
                } else {
                    if (response.statusCode == 403) {
                        console.log("Invalid CSRF token. Reconnecting..")
                        //Invalid Token

                        Connect().then(function () {
                            ByDRequest(options, callback)
                        }).catch(function (error, response) {
                            callback(error, response)
                        })
                    } else {
                        console.log("Request response with status: " + response.statusCode +
                            "\nRequest headers: " + JSON.stringify(response.headers))
                        callback(error, response, JSON.parse(body));

                    }
                }
            });
        })
            .catch(function () {

                Connect().then(function () {
                    ByDRequest(options, callback)
                }).catch(function (error, response) {
                    callback(error, response)
                })
                // }
            })
    })
        .catch(function (e) {

            console.error(e)
            Connect().then(function () {
                ByDRequest(options, callback)
            }).catch(function (error, response) {
                callback(error, response)
            })
            // }
        })
}

/**
 * Get ByDesign ServiceOrder through a custom oData service
 * @param {*} query 
 * @param {*} callback 
 * */
function GetServiceOrder(serviceOrderID, callback) {
    var options = {}

    options.url = bydDest.destinationConfiguration.URL + bydRoute.target.entryPath + model_serviceorder + "('" + serviceOrderID + "')?$format=json"
    options.method = "GET"

    ByDRequest(options, function (error, response, body) {
        if (error) {
            callback(error);
        } else {
            callback(null, formatByDResp(body));
        }
    });
}

/**
 * There is no "login" endpoint in ByD. Instead the Base64 credentials should be passed in
 * the header of a GET Request. From the response of this request, we retrieve a CSRF token
 * that is required for any other method (POST/PATCH/DELETE etc...). Session Cookies are also 
 * required and in this app all of them are stored in cache.
 */
let Connect = function () {

    return new Promise(function (resolve, reject) {

        var options = {
            url: bydDest.destinationConfiguration.URL + bydRoute.target.entryPath + model_sales,
            method: "GET"
        };

        ByDRequest(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log("BYD Reached successfully!")
                setCookiesCache(response.headers['set-cookie'], function () {
                    setByDToken(response.headers["x-csrf-token"])
                    resolve();
                });
            } else {
                console.error("Error reaching ByD. \n" + response.statusCode + " - " + error)
                reject(error, response);
            }
        });
    })
}

let getCookiesCache = function (method) {
    return new Promise(function (resolve, reject) {

        if (method == "GET" || method == "HEAD") {
            // Get Method doesnt require token
            return resolve(null)
        }

        redisClient.lrange(hash_Session, 0, -1, function (err, cookies) {
            if (cookies.length > 0) {
                console.log("Cached ByD cookies Retrieved")
                resolve(cookies)
            } else {
                console.log("Cached ByD cookies not found")
                reject();
            }
        });
    })
}

let getTokenCache = function (method) {
    return new Promise(function (resolve, reject) {

        if (method == "GET" || method == "HEAD") {
            // Get Method doesnt require token
            return resolve("fetch")
        }

        redisClient.hget(hash_csrf, hash_csrf, function (error, csrfToken) {
            if (!csrfToken) {
                //No Token in cache
                console.log("No ByD CSRF Token in cache")
                reject()
            } else {
                resolve(csrfToken)

            }
        })
    })
}

function setCookiesCache(cookies, callback) {
    // Dump Previous Cookies Cache and creates a new one
    redisClient.del(hash_Session, function () {
        redisClient.rpush(hash_Session, cookies, function () {
            console.log("Storing ByD Cookies in cache")
            callback();
        });
    })
}

function setByDToken(csrfToken) {
    //Store the Session Timeout
    redisClient.hset(hash_csrf, hash_csrf, csrfToken)
    console.log("Storing ByD CSRF token in cache")
}

function formatByDResp(output) {
    if (output.hasOwnProperty("d")) {
        output = output.d
    }

    if (output.hasOwnProperty("results")) {
        output.value = output.results
        delete output.results;
    }

    return output
}
