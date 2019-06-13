# BYD_QUALTRICS - Integration scenario between SAP Business ByDesign and Qualtrics

This package contains 2 items:
- An SAP Cloud Platform Integration package that stores survey reponse details into SAP Business ByDesing
- A sample code nodejs application that creates a Qualtrics survey based on a SAP Business ByDesign Service Order Name. 

### nodejs sample application
Please check for more details at the folder [BYD_TO_QUALTRICS_NODEJSAPP](https://github.com/TrinidadMG/byd_qualtrics/tree/master/ByD_to_Qualtrics_nodejsapp).

### SAP Cloud Platform Integration package
The zip file [Qualtrics_ByD_IntegrationFlow.zip](https://github.com/TrinidadMG/byd_qualtrics/blob/master/Qualtrics_ByD_IntegrationFlow.zip) is an SAP Cloud Platform Integration Package.
This package can be imported into your SAP Cloud Platform Integration tenant.

The scenario implemented by this package is the following:
- The flow is started after a user fills a specific Qualtrics survey we have configured with an action (the Qualtrics action will call our CPI flow)
- The flow is preparing a POST call to ByDesign out of the received Qualtrics survey response details 

The scenario makes use of some [SAP Business ByDesign custom OData services](https://github.com/B1SA/hackathon/tree/master/ByDBackend), some of them can be found at the [Service Order custom OData service sample(https://github.com/SAP/sapbydesign-api-samples/blob/master/End-to-End%20Scenarios/Custom%20OData%20Service/tmserviceorder.xml)

### Usage
You can import the SAP Cloud Platform Integration package zip file [Qualtrics_ByD_IntegrationFlow.zip](https://github.com/TrinidadMG/byd_qualtrics/blob/master/Qualtrics_ByD_IntegrationFlow.zip) into your SAP Cloud Platform Integration tenant and configure it for your specific ByDesign and Qualtrics tenants.

# License
The sample code and package published here are released under the terms of the MIT license. See [LICENSE](LICENSE) for more information or see https://opensource.org/licenses/MIT.
