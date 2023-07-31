import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, ScanCommand, DeleteCommand, UpdateCommand, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(client);
const CONNECTIONS_TABLE_NAME = `csci5410-sdp12-ingame-connections`;
const MATCH_TABLE_NAME = `csci5410-sdp12-match`;
const TRIVIA_QUESTION_TABLE_NAME = `csci-sdp12-questions`; 

let CONNECTIONS_CACHE = {};

const storeConnection = async ({ username, connectionId, teamId }) => {
    try {
        const command = new PutCommand({
            TableName: CONNECTIONS_TABLE_NAME,
            Item: {
                connection_id: connectionId,
                username: username,
                team_id: teamId
            }
        });
        await docClient.send(command);
        await syncCache();
    } catch (e) {
        console.log("error storing connection to db", e);
    }
}

const addMatchInstanceIdToDB = async ({ connectionId, teamId, matchInstanceId }) => {
    const connections = await fetchConnections();
    CONNECTIONS_CACHE = _transformConnections(connections);
    const connectionIds = getTeamSpecificConnections(teamId);
    console.log(`setting current match instance id ${matchInstanceId} to all the connection ids of the team ${teamId}`, connectionIds);
    try {
        for (let conId of connectionIds) {
            const command = new UpdateCommand({
                TableName: CONNECTIONS_TABLE_NAME,
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
        await syncCache();
    } catch (e) {
        console.log("error storing connection to db", e);
    }
}

const removeConnection = async ({ connectionId }) => {
    try {
        const command = new DeleteCommand({
            TableName: CONNECTIONS_TABLE_NAME,
            Key: {
                connection_id: connectionId,
            },
        });
        await docClient.send(command);
        await syncCache();
    } catch (e) {
        console.log("error deleting connection from db", e);
    }
}

const updateAnswer = async ({ matchInstanceId, timestampCreated, questionId, answerOptionId }) => {
    try {
        const command = new UpdateCommand({
            TableName: MATCH_TABLE_NAME,
            Key: {
                match_instance_id: matchInstanceId,
                timestamp_created: timestampCreated
            },
            UpdateExpression: "SET match_config.answers.#qId = :aOId",
            ExpressionAttributeValues: {
                ":aOId": answerOptionId
            },
            ExpressionAttributeNames: {
                "#qId": questionId
            }
        });
        await docClient.send(command);
    } catch (e) {
        console.log("error updating answer to the question", e);
    }
}

const updateScore = async ({ matchInstanceId, timestampCreated, updatedScore }) => {
    try {
        const command = new UpdateCommand({
            TableName: MATCH_TABLE_NAME,
            Key: {
                match_instance_id: matchInstanceId,
                timestamp_created: timestampCreated
            },
            UpdateExpression: "SET score = :score",
            ExpressionAttributeValues: {
                ":score": updatedScore
            }
        });
        await docClient.send(command);
    } catch (e) {
        console.log("error updating answer to the question", e);
    }
}

const getTeamAnswers = async ({ matchInstanceId, timestampCreated }) => {
    let matchData = [];
    try {
        let command = new GetCommand({
            TableName: MATCH_TABLE_NAME,
            Key: {
                match_instance_id: matchInstanceId,
                timestamp_created: timestampCreated
            }
        });
        matchData = [(await docClient.send(command)).Item].map((item) => {
            const answersRecorded = item.match_config.answers;
            return Object.entries(answersRecorded).map(([key, value]) => {
                return {
                    questionId: key,
                    answerOptionId: value
                };
            })
        })[0];
        console.log("match data for questions and answers is ", matchData);
    } catch (e) {
        console.log("error getting team answer to the question", e);
    }
    return matchData;
}
const getCorrectAnswers = async (questionIds) => {
    const answers = [];
    try {
        for(let qId of questionIds){
            const command = new GetCommand({
                TableName: TRIVIA_QUESTION_TABLE_NAME,
                Key:{
                    id: qId
                }
            });
            const question = (await docClient.send(command)).Item;
            answers.push({
                questionId: qId,
                answerOptionId: question.answers,
                points: question.points
            });
        }
    } catch (e) {
        console.log("error getting correct answer to the question", e);
    }
    return answers;
}

const syncCache = async () => {
    const connections = await fetchConnections();
    CONNECTIONS_CACHE = _transformConnections(connections);
    console.log("connections are ", CONNECTIONS_CACHE);
}



const fetchConnections = async () => {
    let result;
    try {
        const command = new ScanCommand({ TableName: CONNECTIONS_TABLE_NAME });
        result = (await docClient.send(command)).Items;
    } catch (e) {
        console.log("error fetching all connections data from db", e);
    }
    return result;
}

const getTeamSpecificConnections = (teamId) => {
    return Object.entries(CONNECTIONS_CACHE).filter(([key, value]) => {
        return value.teamId === teamId;
    }).map(([key, value]) => {
        return key;
    });
}

const _transformConnections = (connections) => {
    const map = {};
    connections.forEach(connection => {
        map[connection.connection_id] = {
            username: connection.username,
            matchInstanceId: connection.match_instance_id,
            teamId: connection.team_id
        }
    });
    return map;
}

export { 
    storeConnection, 
    removeConnection, 
    CONNECTIONS_CACHE, 
    addMatchInstanceIdToDB, 
    updateAnswer, 
    updateScore,
    getTeamAnswers,
    getCorrectAnswers,
    syncCache
};