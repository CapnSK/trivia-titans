import handleNewConnection from "./handleNewConnection.mjs";
import closeConnection from "./closeConnection.mjs"
import {sendMessage, sendChatHistory} from "./sendMessage.mjs"
import { ApiGatewayManagementApi } from "@aws-sdk/client-apigatewaymanagementapi";

const WS_API_POST_URL = `https://orzh9gsny1.execute-api.us-east-1.amazonaws.com/dev`;
const client = new ApiGatewayManagementApi({ endpoint: WS_API_POST_URL });

const data_store = {};

const handler = async (event) => {
  const { connectionId, routeKey } = event.requestContext;
  let body = {};
  try {
    if (event.body) {
      body = JSON.parse(event.body);
    }
  } catch (e) {
    console.log("Error parsing body", e);
  }

  let teamId = body.teamId;
  if(teamId && !data_store[teamId]){
    data_store[teamId]={};
  }

  console.log("team id is "+teamId+" connection id is "+connectionId+" user id if present is "+(data_store[teamId] && data_store[teamId][connectionId] || "not present"));
  console.log("for routeKey "+routeKey+" data store at the time of entering is ", data_store);

  switch (routeKey) {
    case "$connect":
      await handleNewConnection(event);
      break;
    case "$disconnect":
      teamId = Object.keys(data_store).filter(key=>key).find(tId=>{
        return Object.keys(data_store[tId]).findIndex(conId=> conId === connectionId) !== -1 ? true : false;
      });
      console.log("teamId for disconnect route is ", teamId);
      await sendMessage(client, Object.keys(data_store[teamId]), { systemMessage: `${data_store[teamId][connectionId]} has left` }, data_store[teamId]);
      await closeConnection(event);
      delete data_store[teamId][connectionId];
      await sendMessage(client, Object.keys(data_store[teamId]), { members: Object.values(data_store[teamId]) }, data_store[teamId]);
      break;
    case "$default":
      break;
    case "setName":
      data_store[teamId][connectionId] = body.name;
      await sendMessage(client, Object.keys(data_store[teamId]), { members: Object.values(data_store[teamId]) }, data_store[teamId]);
      await sendMessage(client, Object.keys(data_store[teamId]), { systemMessage: `${data_store[teamId][connectionId]} has joined the chat` }, data_store[teamId]);
      break;
    case "sendPrivate":
      await sendMessage(
        client,
        [Object.keys(data_store[teamId]).find(key => data_store[teamId][key] === body.to)].filter(id => !!id),
        { userMessage: { [data_store[teamId][connectionId]]: body.message, messageType: "private" } }, data_store[teamId]
      );
      break;
    case "sendPublic":
      await sendMessage(
        client,
        Object.keys(data_store[teamId]).filter((conId) => conId !== connectionId),
        { userMessage: { [data_store[teamId][connectionId]]: body.message, messageType: "public" } }, data_store[teamId]
      );
      break;
    case "getChatHistory":
      //To Do: implement a method to return chat history for a user
      await sendChatHistory(
        client,
        data_store[teamId][connectionId],
        connectionId
      );
      break;
  }
  // TODO implement
  const response = {
    statusCode: 200,
    body: "",
  };
  return response;
};

export { handler };
