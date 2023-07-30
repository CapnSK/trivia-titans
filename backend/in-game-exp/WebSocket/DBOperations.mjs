import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient,  PutCommand, ScanCommand, DeleteCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = `csci5410-sdp12-ingame-connections`;

let CONNECTIONS_CACHE = {};

const storeConnection = async ({username, connectionId, teamId}) => {
    try{
        const command = new PutCommand({
            TableName: TABLE_NAME,
            Item: {
                connection_id: connectionId,
                username: username,
                team_id: teamId
            }
        });
        await docClient.send(command);
        const connections = await fetchConnections();
        CONNECTIONS_CACHE = _transformConnections(connections);
        console.log("connections are ", CONNECTIONS_CACHE);    
    } catch(e){
        console.log("error storing connection to db",e);
    }
}

const addMatchInstanceIdToDB = async({connectionId, teamId, matchInstanceId})=> {
    const connections = await fetchConnections();
    CONNECTIONS_CACHE = _transformConnections(connections);
    const connectionIds = getTeamSpecificConnections(teamId);
    console.log(`setting current match instance id ${matchInstanceId} to all the connection ids of the team ${teamId}`, connectionIds);
    try{
        for(let conId of connectionIds){
            const command = new UpdateCommand({
                TableName: TABLE_NAME,
                Key: {
                    connection_id: conId
                },
                UpdateExpression: "set match_instance_id = :mId",
                ExpressionAttributeValues: {
                    ":mId": matchInstanceId
                }
            });
            await docClient.send(command);
        }
        //once all items are set then update the cache with latest data
        const connections = await fetchConnections();
        CONNECTIONS_CACHE = _transformConnections(connections);
        console.log("connections are ", CONNECTIONS_CACHE);   
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
        const connections = await fetchConnections();
        CONNECTIONS_CACHE = _transformConnections(connections);
        console.log("connections are ", CONNECTIONS_CACHE);    
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

const getTeamSpecificConnections = (teamId)=>{
    return Object.entries(CONNECTIONS_CACHE).filter(([key, value])=>{
        return value.teamId === teamId;
    }).map(([key, value])=>{
        return key;
    });
}

const _transformConnections = (connections)=>{
    const map={};
    connections.forEach(connection=>{
        map[connection.connection_id]={
            username: connection.username,
            matchInstanceId: connection.match_instance_id,
            teamId: connection.team_id
        }
    });
    return map;
}

export { storeConnection, removeConnection, CONNECTIONS_CACHE, addMatchInstanceIdToDB };