import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { DynamoDBDocumentClient, PutCommand, ScanCommand, DeleteCommand, UpdateCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import axios from "axios";

const client = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(client);
const CONNECTIONS_TABLE_NAME = `ingame-connections`;
const MATCH_TABLE_NAME = `match`;
const TRIVIA_QUESTION_TABLE_NAME = `questions`; 
const TRIVIA_TABLE_NAME = `trivia`; 
const TEAM_TABLE_NAME = `teams`; 
const GC_URL = `https://us-east1-csci5410-serverless-390903.cloudfunctions.net/updateRawData`;

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
        if(answerOptionId){
            const getCommand = new GetCommand({
                TableName: MATCH_TABLE_NAME,
                Key: {
                    match_instance_id: matchInstanceId
                }
            });

            const matchInstance = (await docClient.send(getCommand)).Item;
            const existingMatchAnswers = matchInstance.answers || {};
            existingMatchAnswers[questionId] = answerOptionId;
            const command = new UpdateCommand({
                TableName: MATCH_TABLE_NAME,
                Key: {
                    match_instance_id: matchInstanceId
                },
                UpdateExpression: "SET match_config.answers = :answers",
                ExpressionAttributeValues: {
                    ":answers": existingMatchAnswers
                }
            });
            await docClient.send(command);
        }
    } catch (e) {
        console.log("error updating answer to the question", e);
    }
}

const resetScore = async ({ matchInstanceId, timestampCreated}) => {
    try {
        const command = new UpdateCommand({
            TableName: MATCH_TABLE_NAME,
            Key: {
                match_instance_id: matchInstanceId
            },
            UpdateExpression: "SET score = :score",
            ExpressionAttributeValues: {
                ":score": "0"
            }
        });
        await docClient.send(command);
    } catch (e) {
        console.log("error resetting score", e);
    }
}

const updateScore = async ({ matchInstanceId, timestampCreated, updatedScore }) => {
    let totalScore = updatedScore;
    try {
        const getCommand = new GetCommand({
            TableName: MATCH_TABLE_NAME,
            Key: {
                match_instance_id: matchInstanceId
            }
        });
        const item = (await docClient.send(getCommand)).Item;
        console.log("item fetched is", item);
        totalScore = ((Number(item.score) || 0)+Number(updatedScore));
        console.log("total score prev score & current score", totalScore, item.score, updatedScore);
        const command = new UpdateCommand({
            TableName: MATCH_TABLE_NAME,
            Key: {
                match_instance_id: matchInstanceId
            },
            UpdateExpression: "SET score = :score",
            ExpressionAttributeValues: {
                ":score": totalScore+""
            }
        });
        await docClient.send(command);
    } catch (e) {
        console.log("error updating answer to the question", e);
    }
    return totalScore;
}

const fetchScore = async ({matchInstanceId}) => {
    let score;
    try {
        const getCommand = new GetCommand({
            TableName: MATCH_TABLE_NAME,
            Key: {
                match_instance_id: matchInstanceId
            }
        });
        const item = (await docClient.send(getCommand)).Item;
        score = item.score;
        console.log("fetched score is", score);
    } catch (e) {
        console.log("error fetching score", e);
    }
    return score;
}

const updateMatchStatus = async ({ matchInstanceId, timestampCreated, status }) => {
    try {
        const command = new UpdateCommand({
            TableName: MATCH_TABLE_NAME,
            Key: {
                match_instance_id: matchInstanceId
            },
            UpdateExpression: "SET match_status = :status",
            ExpressionAttributeValues: {
                ":status": status
            }
        });
        await docClient.send(command);
    } catch (e) {
        console.log("error updating match status", e);
    }
}

const fetchMatchInstanceDetails = async ({matchInstanceId, teamId}) => {
    let data = {
        matchInstanceData: undefined,
        triviaData: undefined,
        questionsData: undefined,
        teamData: undefined
    };
    if(matchInstanceId){
        try{
            const command = new GetCommand({
                TableName: MATCH_TABLE_NAME,
                Key:{
                    match_instance_id: matchInstanceId
                }
            });
    
            data.matchInstanceData = (await docClient.send(command)).Item;

            if(data.matchInstanceData?.match_config.trivia_id){
                data.triviaData = await fetchTriviaData(data.matchInstanceData.match_config.trivia_id);

                if(data.triviaData?.questions){
                    const questionFetchPromises = data.triviaData.questions.map((questionId)=>{
                        return fetchQuestionData(questionId);
                    });
                    data.questionsData = await Promise.all(questionFetchPromises);
                }
            }

            if(teamId){
                data.teamData = await fetchTeamData(teamId);                
            }
        } catch(e){
            console.log("error fetching data from match instance id", matchInstanceId, e);
        }
    }
    return data;
}

const fetchTeamData = async (teamId) => {
    let data;
    if(teamId){
        try{
            const command = new GetCommand({
                TableName: TEAM_TABLE_NAME,
                Key:{
                    id: teamId
                }
            });
            data = (await docClient.send(command)).Item;
        } catch(e){
            console.log("error fetching data from tean id", teamId, e);
        }
    }
    return data;
}

const fetchTriviaData = async (triviaId) => {
    let data;
    if(triviaId){
        try{
            const command = new GetCommand({
                TableName: TRIVIA_TABLE_NAME,
                Key:{
                    id: triviaId
                }
            });
            data = (await docClient.send(command)).Item;
        } catch(e){
            console.log("error fetching data from trivia id", triviaId, e);
        }
    }
    return data;
}

const fetchQuestionData = async (questionId) => {
    let data;
    if(questionId){
        try{
            const command = new GetCommand({
                TableName: TRIVIA_QUESTION_TABLE_NAME,
                Key:{
                    id: questionId
                }
            });
            data = (await docClient.send(command)).Item;
        } catch(e){
            console.log("error fetching data from question id", questionId, e);
        }
    }
    return data;
}

const getTeamAnswers = async ({ matchInstanceId, timestampCreated }) => {
    let matchData = [];
    try {
        let command = new GetCommand({
            TableName: MATCH_TABLE_NAME,
            Key: {
                match_instance_id: matchInstanceId
            }
        });
        matchData = [(await docClient.send(command)).Item].map((item) => {
            const answersRecorded = item.match_config.answers;
            return answersRecorded && Object.entries(answersRecorded) ? Object.entries(answersRecorded).map(([key, value]) => {
                return {
                    questionId: key,
                    answerOptionId: value
                };
            }) : [];
        })[0] || [];
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

const uploadScoresToLeaderboard = async ({teamId})=>{
    try{
        const teamData = await fetchTeamData(teamId);
        console.log("The original teamData is", teamData);
        const objToSend = {
            team_id: teamId,
            admin: teamData?.admin?.username,
            team_name: teamData?.team_name || teamData?.name,
            members: teamData?.members.map(mem=>mem.userName)
        };
        console.log("The team data being sent is", objToSend);
        await axios.post(GC_URL, [objToSend])
    } catch (e){
        console.log("error uploading data to GC", e);
    }
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
    syncCache,
    updateMatchStatus,
    fetchMatchInstanceDetails,
    resetScore,
    fetchScore,
    uploadScoresToLeaderboard
};