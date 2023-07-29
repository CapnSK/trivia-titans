import handleNewConnection from "./handleNewConnection.mjs";
import closeConnection from "./closeConnection.mjs"
import {sendMessage, sendChatHistory} from "./sendMessage.mjs"
import { ApiGatewayManagementApi } from "@aws-sdk/client-apigatewaymanagementapi";

const WS_API_POST_URL = `https://orzh9gsny1.execute-api.us-east-1.amazonaws.com/dev`;
const client = new ApiGatewayManagementApi({ endpoint: WS_API_POST_URL });

const names = {};

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


  switch (routeKey) {
    case "$connect":
      await handleNewConnection(event);
      break;
    case "$disconnect":
      await sendMessage(client, Object.keys(names), { systemMessage: `${names[connectionId]} has left` }, names);
      await closeConnection(event);
      delete names[connectionId];
      await sendMessage(client, Object.keys(names), { members: Object.values(names) }, names);
      break;
    case "$default":
      break;
    case "setName":
      names[connectionId] = body.name;
      await sendMessage(client, Object.keys(names), { members: Object.values(names) }, names);
      await sendMessage(client, Object.keys(names), { systemMessage: `${names[connectionId]} has joined the chat` }, names);
      break;
    case "sendPrivate":
      await sendMessage(
        client,
        [Object.keys(names).find(key => names[key] === body.to)].filter(id => !!id),
        { userMessage: { [names[connectionId]]: body.message, messageType: "private" } }, names
      );
      break;
    case "sendPublic":
      await sendMessage(
        client,
        Object.keys(names).filter((conId) => conId !== connectionId),
        { userMessage: { [names[connectionId]]: body.message, messageType: "public" } }, names
      );
      break;
    case "getChatHistory":
      //To Do: implement a method to return chat history for a user
      await sendChatHistory(
        client,
        names[connectionId],
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
