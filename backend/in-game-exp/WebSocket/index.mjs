
import { ApiGatewayManagementApi } from "@aws-sdk/client-apigatewaymanagementapi";
import { storeConnection, removeConnection, CONNECTIONS_CACHE } from "./DBOperations.mjs";

const WS_API_POST_URL = `https://94l1ahmzuf.execute-api.us-east-1.amazonaws.com/dev`;
const client = new ApiGatewayManagementApi({ endpoint: WS_API_POST_URL });


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

  let eventEmitted;
  if (routeKey !== "$connect" && routeKey !== "$disconnect") {
    eventEmitted = body.event;
  }


  switch (routeKey) {
    case "$connect":
      console.log("connection added", connectionId);
      break;
    case "$disconnect":
      await removeClient(connectionId);
      break;
    case "$default":
      console.log("No route matched");
      break;
    case "emitEvent":
      if (eventEmitted) {
        await handleEvent(eventEmitted, connectionId);
      } else {
        console.log("for this route event key is mandatory and not provided by client body sent -", body);
      }
      break;
  }

  async function removeClient(connectionId) {
    try {
      await removeConnection({connectionId});
    } catch (e) {
      console.log("error removing connection from db", e);
    }
  }

  async function handleEvent(eventEmitted, connectionId) {
    const eventType = eventEmitted.type;
    const data = eventEmitted.data;
    const context = eventEmitted.context;
    if (eventType) {
      try {
        switch (eventType) {
          case "INTRODUCE":
            let username = data.username;
            await storeConnection({ username, connectionId });
            break;
          case "JOIN_GAME":
            username = data.username;
            const startTime = data.startTime;
            const matchInstanceId = context?.matchSpec?.matchInstanceId || "";
            await postEvent({
              sender: username,
              type: "JOIN_GAME",
              data: {
                gameStartTime: startTime,
                matchInstanceId
              }
            });
            break;
          case "START_GAME":
            await postEvent({
              sender: username,
              type: "START_GAME",
              data: {
                matchInstanceId
              }
            });
            break;
          case "MARK_ANSWER":
            // const triviaId = context?.matchSpec?.triviaId || "";
            // const teamId = context?.matchSpec?.teamId || "";
            let questionId = data.questionId;
            const answerId = data.selectedOption;
            await postEvent({
              sender: username,
              type: "MARK_ANSWER",
              data: {
                matchInstanceId,
                questionId,
                answerId
              }
            });
          case "UPDATE_SCORE":
            // const updatedScore = await update_score({
            //   matchInstanceId,
            //   questionId,
            //   answerId
            // });
            await postEvent({
              sender: "system",
              type: "UPDATED_SCORE",
              data: {
                matchInstanceId,
                score: 0
              }
            });
            break;
          case "NEXT_QUESTION":
            questionId = data.questionId;
            await postEvent({
              sender: username,
              type: "NEXT_QUESTION",
              data: {
                matchInstanceId,
                questionId
              }
            });
            break;
        }
      } catch (e) {
        console.log("error performing action for the event emitted", eventEmitted, connectionId, e);
      }
    }
  }

  const response = {
    statusCode: 200,
    body: "",
  };
  return response;
};

async function postEvent(event){
  // const receivers = Object.entries(CONNECTIONS_CACHE).filter(([conId, username])=>{
  //   return username !
  // });
  // await client.postToConnection({
  //   "ConnectionId": id,
  //   "Data": Buffer.from(JSON.stringify(message.members ? message : chatHistory[chatHistory.length-1]))
  // });

  return Promise.resolve();
}


export { handler };
