import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    let statusCode = 200;
    let responseBody;
    console.log("Invoked lambda with ", event);

    try {
        const match_instance_id = `${event?.queryStringParameters?.match_instance_id || ""}`;
        const timestamp_created = `${event?.queryStringParameters?.timestamp_created || ""}`;
        const team_id = `${event?.queryStringParameters?.tId} || ""`;
        const updated_score = `${event?.queryStringParameters?.score || ""}`;
        if (match_instance_id && timestamp_created && updated_score !== undefined && team_id) {
            const command = new UpdateCommand({
                TableName: "match",
                Key: {
                    "timestamp_created": timestamp_created,
                    "match_instance_id": match_instance_id
                },
                UpdateExpression: "set score = :score",
                ExpressionAttributeValues: {
                    ":score": updated_score
                },
                ReturnValues: "ALL_NEW"
            });

            const response = await docClient.send(command);
            console.log(response);
            responseBody = {
                "timestamp_created": timestamp_created,
                "match_instance_id": match_instance_id,
                "score": response.Attributes.score,
                "team_id": team_id
            }
        }
        else {
            statusCode = 400;
            responseBody = {
                message: "Required parameters match_instance_id, timestamp_created, tId & score were not provided"
            }
        }
    } catch (e) {
        console.error(e);
        statusCode = 500;
        responseBody = JSON.stringify(e);
    }

    console.log("Leaving request with ", responseBody);
    return {
        statusCode,
        body: responseBody
    };
}