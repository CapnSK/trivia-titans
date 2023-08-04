import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    let statusCode = 200;
    let responseBody;
    console.log(event);
    try {
        const match_instance_id = `${event?.body?.match_instance_id || ""}`;
        const timestamp_created = `${event?.body?.timestamp_created || ""}`;
        const question_id = `${event?.body?.qId || ""}`;
        const answer_id = `${event?.body?.qId || ""}`;
        if (match_instance_id && timestamp_created) {
            
        }
        else {
            statusCode = 400;
            responseBody = {
                message: "Required parameters match_instance_id and timestamp_created were not provided"
            }
        }
    } catch (e) {
        console.log(e);
        responseBody = JSON.stringify(e);
        statusCode = 500;
    }

    return {
        statusCode,
        body: responseBody
    };
}