# BYD_QUALTRICS - Integration sample between SAP Business ByDesign and Qualtrics
[![SAP](https://i.imgur.com/HBBBde7.png)](https://cloudplatform.sap.com)

This sample code creates a Qualtrics survey based on a SAP Business ByDesign Service Order Name. 

### Overview
- It is coded in [NodeJ](https://nodejs.org/en/)
- Can be deployed anywhere and I suggest to do it in the  [SAP Cloud Platform](https://cloudplatform.sap.com). 
- It makes use of the [SAP Qualtrics APIs](https://api.qualtrics.com/), [SAP Business ByDesign custom OData services](https://github.com/B1SA/hackathon/tree/master/ByDBackend) and more specificaly of the [Service Order custom OData service sample(https://github.com/SAP/sapbydesign-api-samples/blob/master/End-to-End%20Scenarios/Custom%20OData%20Service/tmserviceorder.xml)

### Installation in the Cloud
Clone this repository
```sh
$ git clone https://github.com/TrinidadMG/byd_qualtrics.git
```
Give a name to your app on the [manifest.yml](manifest.yml)

From the root directory, using the [Cloud Foundry CLI](https://docs.cloudfoundry.org/cf-cli/install-go-cli.html) push your app to the SAP CP Cloud Foundry:
```
$ cf push --random-route
```
>*--random-route will avoids name colisions with others that deploy this same app on SCP. You can choose your own app name by changing the application names in the [manifest](manifest.yml)*

*It's ok if you get an error at this point*

The application to run requires a QUALTRICS_URL and a QUALTRICS_TOKEN, please check the [SAP Qualtrics APIs](https://api.qualtrics.com/) for more details how to get the QUALTRICS_TOKEN.
```sh
$ cf set-env <yourAppName> QUALTRICS_URL <YOUR QUALTRICS_URL>
$ cf set-env <yourAppName> QUALTRICS_TOKEN <YOUR QUALTRICS_TOKEN>
```

This application is using SAP Cloud Platform destinations to configure SAP Business ByDesign url and credentials. 
Please check the prerequisites and environment setup instructions at https://github.com/B1SA/cfDestinations/blob/master/README.md to create a destination and required services before starting your app again.

Restart your application (so it can read the new environment variables)
```sh
$ cf restart <your app name set on the manifest.yml>
```

Access the app from the URL route shown in the terminal.

### Usage
- Create a Survey Definition in Qualtrics based on an SAP Business ByDesign Service Order ID: /CreateQualtricsSurvey with a body providing the Service Order ID, for example {"ServiceOrderID": "0000000000011DDFBEA73CE3794B5D1A"}
- Get a Survey Definition from Qualtrics: /GetSurveyDef with a body providing the Survey ID, for example {"SurveyID": "SV_XYZ"}

# License
qualtrics_byd sample is released under the terms of the MIT license. See [LICENSE](LICENSE) for more information or see https://opensource.org/licenses/MIT.
