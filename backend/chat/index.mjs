import handleNewConnection from "./handleNewConnection.mjs";
import closeConnection from "./closeConnection.mjs"
import sendMessage from "./sendMessage.mjs"
import AWS from "aws-sdk";

const WS_API_POST_URL = `https://orzh9gsny1.execute-api.us-east-1.amazonaws.com/dev`;
const client = new AWS.ApiGatewayManagementApi({endpoint: WS_API_POST_URL});

const names = {};

const handler = async (event) => {
  const { connectionId, routeKey } = event.requestContext;
  let body = {};
  try{
    if(event.body){
      body = JSON.parse(event.body);
    }
  } catch(e){
    console.log("Error parsing body",e);
  }
  
  
  switch(routeKey){
    case "$connect":
      await handleNewConnection(event);
      break;
    case "$disconnect":
      await sendMessage(client, Object.keys(names), { systemMessage: `${names[connectionId]} has left` });
      await closeConnection(event);
      delete names[connectionId];
      await sendMessage(client, Object.keys(names), { members: Object.values(names) });
      break;
    case "$default":
      break;
    case "setName":
      names[connectionId] = body.name;
      await sendMessage(client, Object.keys(names), { members: Object.values(names) });
      await sendMessage(client, Object.keys(names), { systemMessage: `${names[connectionId]} has joined the chat` });
      break;
    case "sendPrivate":
      await sendMessage(
        client, 
        [Object.keys(names).find(key => names[key] === body.to)].filter(id=>!!id), 
        body.message
      );
      break;
    case "sendPublic":
      await sendMessage(
        client, 
        Object.keys(names).filter((conId)=>conId !== connectionId), 
        body.message
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
