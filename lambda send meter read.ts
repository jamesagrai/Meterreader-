import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PutCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ region: 'eu-west-2' }); // AWS region for London

export const handler = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2)); // Log the received event

    try {
        if (!event.body) {
            console.log('No body found in the event'); // Log missing body
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'No body found in the event' }),
            };
        }

        const body = JSON.parse(event.body); // Parse the JSON body from the event
        console.log('Parsed body:', JSON.stringify(body, null, 2)); // Log the parsed body

        const { timestamp, meter, reading } = body; // Destructure the necessary fields
        console.log('timestamp:', timestamp, 'meter:', meter, 'reading:', reading); // Log destructured values

        if (!timestamp || !meter || !reading) {
            console.log('Validation failed: Missing required fields'); // Log validation failure
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Missing required fields: timestamp, meter, or reading' }),
            };
        }

        const params = {
            TableName: 'energyData', // Name of the DynamoDB table
            Item: {
                timestamp: timestamp, // Use the timestamp as the partition key
                meter: meter, // Use the provided meter name
                reading: reading, // Use the provided reading value
            },
        };

        console.log('DynamoDB put parameters:', JSON.stringify(params, null, 2)); // Log the parameters

        // Perform the put operation
        const command = new PutCommand(params);
        const result = await client.send(command);
        console.log('DynamoDB response:', JSON.stringify(result, null, 2)); // Log the response from DynamoDB

        console.log('Meter reading added:', params); // Log the successful operation

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Meter reading added successfully' }),
        };
    } catch (err) {
        console.error('Error adding meter reading:', JSON.stringify(err, null, 2)); // Log the error details
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error adding meter reading', error: err.message }),
        };
    }
};
