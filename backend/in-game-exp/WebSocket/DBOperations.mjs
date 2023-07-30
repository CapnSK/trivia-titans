import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = `csci5410-sdp12-ingame-connections`;

const CONNECTIONS_CACHE = {};

const storeConnection = async ({username, connectionId}) => {
    try{
        const command = new PutCommand({
            TableName: TABLE_NAME,
            Item: {
                connection_id: connectionId,
                username: username
            }
        });
        await docClient.send(command);
        const connections = await fetchConnections();
        console.log("connections are ", connections);    
    } catch(e){
        console.log("error storing connection to db",e);
    }
}

const removeConnection = async ({connectionId}) => {
    try{
        const command = new DeleteCommand({
            TableName: TABLE_NAME,
            Key: {
                connection_id: connectionId,
            },
        });
        await docClient.send(command);
        const connections = fetchConnections();
        console.log("connections are ", connections);    
    } catch(e){
        console.log("error deleting connection from db",e);
    }
}

const fetchConnections = async ()=>{
    let result;
    try{
        const command = new ScanCommand({TableName: TABLE_NAME});
        result = (await docClient.send(command)).Items;
    } catch(e){
        console.log("error fetching all connections data from db",e);
    }
    return result;
}

export { storeConnection, removeConnection, CONNECTIONS_CACHE };