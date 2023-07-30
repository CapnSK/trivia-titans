
import { ApiGatewayManagementApi } from "@aws-sdk/client-apigatewaymanagementapi";
import { storeConnection, removeConnection, CONNECTIONS_CACHE, addMatchInstanceIdToDB, updateAnswer } from "./DBOperations.mjs";

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


  const response = {
    statusCode: 200,
    body: "",
  };
  return response;
};

async function removeClient(connectionId) {
  try {
    await removeConnection({ connectionId });
  } catch (e) {
    console.log("error removing connection from db", e);
  }
}

async function handleEvent(eventEmitted, connectionId) {
  const eventType = eventEmitted.type;
  const data = eventEmitted.data;
  const context = eventEmitted.context;

  //predefined variables because switch case does not allow multiple declarations
  let username;
  let matchInstanceId;
  let questionId;
  let teamId;
  let timestampCreated;
  if (eventType) {
    try {
      switch (eventType) {
        case "INTRODUCE":
          teamId = context?.matchSpec?.teamId || ""
          username = data.username;
          await storeConnection({ username, connectionId, teamId });
          break;
        case "JOIN_GAME":
          username = data.username;
          teamId = context?.matchSpec?.teamId || ""
          const startTime = data.startTime;
          matchInstanceId = context?.matchSpec?.matchInstanceId || "";
          await addMatchInstanceIdToDB({ connectionId, teamId, matchInstanceId });
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
          matchInstanceId = context?.matchSpec?.matchInstanceId || "";
          await postEvent({
            sender: username,
            type: "START_GAME",
            data: {
              matchInstanceId
            }
          });
          break;
        case "MARK_ANSWER":
          matchInstanceId = context?.matchSpec?.matchInstanceId || "";
          timestampCreated = context?.matchSpec?.timestampCreated || "";
          // const triviaId = context?.matchSpec?.triviaId || "";
          teamId = context?.matchSpec?.teamId || "";
          questionId = data.questionId;
          const answerOptionId = data.selectedOption;
          await updateAnswer({matchInstanceId, timestampCreated, questionId, answerOptionId});
          await postEvent({
            sender: username,
            type: "MARK_ANSWER",
            data: {
              matchInstanceId,
              questionId,
              answerId: answerOptionId
            }
          });
          break;
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
        case "SUBMIT_QUIZ":
          break;
      }
    } catch (e) {
      console.log("error performing action for the event emitted", eventEmitted, connectionId, e);
    }
  }
}

async function postEvent(event) {
  const matchInstanceId = event.data?.matchInstanceId || "";
  const receivers = Object.entries(CONNECTIONS_CACHE)
  .filter(([conId, value])=>{
    return value.matchInstanceId === matchInstanceId;
  })
  .map(([conId, value])=>{
    return conId;
  });
  console.log("all the recievers are", receivers);
  try{
    await Promise.all(receivers.map(id=>{
      return client.postToConnection({
        "ConnectionId": id,
        "Data": Buffer.from(JSON.stringify(event))
      });
    }));
  } catch(e){
    console.log("error posting event to all the ids")
  }

  return Promise.resolve();
}


export { handler };
