import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({region:"us-east-1"});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    let statusCode = 200;
    let responseBody;
    console.log(event);
    try{
      const match_instance_id = `${event?.queryStringParameters?.match_instance_id || "" }`;
      const timestamp_created = `${event?.queryStringParameters?.timestamp_created || "" }`;
      const match_status = `${event?.queryStringParameters?.match_status || "" }`;
      if(match_instance_id && timestamp_created){
          const command = new UpdateCommand({
              TableName: "match",
              Key: {
                  "timestamp_created": timestamp_created,
                  "match_instance_id": match_instance_id
              },
              UpdateExpression: "set match_status = :status",
              ExpressionAttributeValues: {
                  ":status": match_status || "IN_PROGRESS"
              },
              ReturnValues: "ALL_NEW"
          });
      
        const response = await docClient.send(command);
        console.log(response);
        responseBody = {
          "timestamp_created": timestamp_created,
          "match_instance_id": match_instance_id,
          "match_status": response.Attributes.match_status
        }
      } 
      else {
          statusCode = 400;
          responseBody = {
              message: "Required parameters match_instance_id and timestamp_created were not provided"
          }
      }
    } catch(e){
      console.error(e);
      responseBody = JSON.stringify(e);
      statusCode = 500;
    }
  return {
    statusCode,
    body: responseBody
  };
};

//handler({queryStringParameters:{match_instance_id:"abc-1235", timestamp_created: "1689012982155"}}).then(console.log);