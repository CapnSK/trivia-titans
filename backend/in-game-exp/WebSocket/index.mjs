
import { ApiGatewayManagementApi } from "@aws-sdk/client-apigatewaymanagementapi";
import { storeConnection, removeConnection, CONNECTIONS_CACHE, addMatchInstanceIdToDB, updateAnswer, updateScore, getTeamAnswers,  getCorrectAnswers, syncCache, updateMatchStatus, fetchMatchInstanceDetails, resetScore, fetchScore, uploadScoresToLeaderboard} from "./DBOperations.mjs";

const WS_API_POST_URL = `https://cll7zfy8rl.execute-api.us-east-1.amazonaws.com/dev`;
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
      matchInstanceId = context?.matchSpec?.matchInstanceId || "";
      timestampCreated = context?.matchSpec?.timestampCreated || "";
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
          await addMatchInstanceIdToDB({ connectionId, teamId, matchInstanceId });
          await updateMatchStatus({matchInstanceId, timestampCreated, status:"IN_LOBBY"});
          const matchInstanceData = await fetchMatchInstanceDetails({matchInstanceId, teamId});
          console.log("match instance data is", matchInstanceData);
          // const triviaData = await fetchTriviaData(matchInstanceData.match_config.trivia_id);
          // const questionsData = await fetchQuestionsData(triviaData?.questions);
          await postEvent({
            sender: username,
            type: "JOIN_GAME",
            data: {
              gameStartTime: startTime,
              matchInstanceId,
              matchInstance: matchInstanceData
            }
          });
          break;
        case "START_GAME":
          await updateMatchStatus({matchInstanceId, timestampCreated, status:"IN_PROGRESS"});
          await resetScore({matchInstanceId, timestampCreated});
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
          teamId = context?.matchSpec?.teamId || "";
          questionId = data.questionId;
          const answerOptionId = data.selectedOption;
          console.log("got options from input as", answerOptionId);
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
          
          const updatedScore = await calculateUpdatedScore({matchInstanceId, timestampCreated});
          const totalScore = await updateScore({
            matchInstanceId,
            timestampCreated,
            updatedScore
          });
          await postEvent({
            sender: username,
            type: "UPDATED_SCORE",
            data: {
              matchInstanceId,
              updatedScore: totalScore
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
          //To Do: call appropriate lambdas to finalize the match data
          teamId = context?.matchSpec?.teamId || "";
          await updateMatchStatus({matchInstanceId, timestampCreated, status:"COMPLETED"});
          const finalScore = await fetchScore({matchInstanceId});
          await postEvent({
            sender: username,
            type: "QUIZ_SUBMITTED",
            data: {
              matchInstanceId,
              score: finalScore
            }
          });
          await uploadScoresToLeaderboard({teamId});
          break;
      }
    } catch (e) {
      console.log("error performing action for the event emitted", eventEmitted, connectionId, e);
    }
  }
}

async function postEvent(event) {
  const matchInstanceId = event.data?.matchInstanceId || "";
  await syncCache();
  console.log("current match instance id is ",matchInstanceId);
  console.log("current event to post is ",event);
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
    console.log("error posting event to all the ids");
  }

  return Promise.resolve();
}

async function calculateUpdatedScore({matchInstanceId, timestampCreated}){
  const teamAnswers = await getTeamAnswers({matchInstanceId, timestampCreated}); //{questionId: qId, answerptionId: oId}
  const questionIds = teamAnswers.map(({questionId})=>{
    return questionId;
  });
  console.log("questionIds are ", questionIds);
  const correctAnswers = await getCorrectAnswers(questionIds);
  console.log("correct answers are ", correctAnswers);
  let score = 0;
  for(let { questionId, answerOptionId} of teamAnswers){
    score += (correctAnswers.filter((cA)=>{
      return questionId === cA.questionId;
    }).map((cA)=>{
      const actual = Array.isArray(answerOptionId) ? answerOptionId : [answerOptionId];
      const expected = Array.isArray(cA.answerOptionId) ? cA.answerOptionId : [cA.answerOptionId];
      console.log("for question "+cA.questionId+" answers actual and expected array are", actual, expected);
      return exactMatch(actual, expected) ? Number(cA.points) : 0;
    })[0] || 0);
    console.log(`score till now is ${score} for question ${questionId} given answer ${answerOptionId}`, correctAnswers);
  }
  console.log("final calculated score is", score);
  return score;
}

function exactMatch(actualAnsArray, expectedAnsArray){
  return expectedAnsArray.every(ansOpt=>{
    return actualAnsArray.includes(ansOpt);
  }) && expectedAnsArray.length === actualAnsArray.length;
}


export { handler };
