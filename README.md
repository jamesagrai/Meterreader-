# Meter Reading Web App

This web application will capture readings entered by a user and store them in a database. 


## Description
The front end is hosted on an S3 bucket. Each meter is in a different html file which means there will be a unique url for each machine. This allows for a QR code on the meter to direct to the corresponding meter webpage. A reading is entered and sent to the database (DynamoDB) via Lambda and API Gateway. 
## Deployment
1. Choose an availability zone for all components to be set up in.

2. Create a DynamoDB called energyData. Use "timestamp" as the name of the partition key with the data-type set to string. 

3. Create IAM role called Dynamolambda using JSON from the IAM for Lambda file. 

4. Set up a lambda function called "sendMeterRead", with the runtime being Node.js22x. Set Architecture to arm64. For permissions, expand the change default execution role section, choose use an existing role and select the DynamoLambda role from the drop down menu. Once created, copy and paste the lambda javascript into the code tab and click deploy. The region in the javascript is set to 'eu-west-2'. Change if using a different availability zone.

5. Once created, select "add trigger" and choose API Gateway. Select HTTP API and choose open for security. Expand the additional settings and tick the Cross Origin Resource Sharing (CORS) box. Click add to complete.

6. To test the lambda, enter the JSON from the lambdatest file and click test. If the test works, the data from the JSON will create an item in the DynamoDB. If not, this should be resolved before completing additional steps. 

7. Create an S3 bucket with a unique name. Upload the HTML files from the frontend folder into the bucket and set as public. Add the access policy JSON to enable public access. 

8. Submit a reading to the front end. If it works, there will be a message tp say the reading was successfully submitted. If there is an error, check the configuration of the API Gateway and ajust where needed.

9. HTML code generates cookie session which lasts one hour for user, improves functionality and ease of use when scanning multiple QR codes.
