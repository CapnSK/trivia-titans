import { filter } from "rxjs/operators";
import { webSocketClient } from "../lib/sockets/";
import { cloneDeep } from "lodash";
// import { setInGameContext } from "../../"

const eventStructure = {
    action: "emitEvent",
    event: {
        type: "",
        context: {
            matchSpec:{

            }
        },
        data: {

        }
    }
}


function introduce({
    username,
    teamId
}){
    const eventData = cloneDeep(eventStructure);
    eventData.event.type = "INTRODUCE";
    eventData.event.context.matchSpec.teamId = teamId;
    eventData.event.data.username = username;
    console.log("event to be emitted is", eventData);
    webSocketClient.emit(eventData);
}

function join_game({
    username,
    teamId,
    matchInstanceId,
    timestampCreated
}){
    const eventData = cloneDeep(eventStructure);
    eventData.event.type = "JOIN_GAME";
    eventData.event.context.matchSpec.teamId = teamId;
    eventData.event.context.matchSpec.matchInstanceId = matchInstanceId;
    eventData.event.context.matchSpec.timestampCreated = timestampCreated;
    eventData.event.data.username = username;
    console.log("event to be emitted is", eventData);
    webSocketClient.emit(eventData);
}

function start_game({
    username,
    teamId,
    matchInstanceId,
    timestampCreated
}){
    const eventData = cloneDeep(eventStructure);
    eventData.event.type = "START_GAME";
    eventData.event.context.matchSpec.teamId = teamId;
    eventData.event.context.matchSpec.matchInstanceId = matchInstanceId;
    eventData.event.context.matchSpec.timestampCreated = timestampCreated;
    eventData.event.data.username = username;
    console.log("event to be emitted is", eventData);
    webSocketClient.emit(eventData);
}

function mark_answer({
    username,
    teamId,
    matchInstanceId,
    timestampCreated,
    questionId,
    selectedOption
}){
    const eventData = cloneDeep(eventStructure);
    eventData.event.type = "MARK_ANSWER";
    eventData.event.context.matchSpec.teamId = teamId;
    eventData.event.context.matchSpec.matchInstanceId = matchInstanceId;
    eventData.event.context.matchSpec.timestampCreated = timestampCreated;
    eventData.event.data.username = username;
    eventData.event.data.questionId = questionId;
    eventData.event.data.selectedOption = selectedOption;
    console.log("event to be emitted is", eventData);
    webSocketClient.emit(eventData);
}

function update_score(
    {
    username,
    teamId,
    matchInstanceId,
    timestampCreated
}){
    const eventData = cloneDeep(eventStructure);
    eventData.event.type = "UPDATE_SCORE";
    eventData.event.context.matchSpec.teamId = teamId;
    eventData.event.context.matchSpec.matchInstanceId = matchInstanceId;
    eventData.event.context.matchSpec.timestampCreated = timestampCreated;
    eventData.event.data.username = username;
    console.log("event to be emitted is", eventData);
    webSocketClient.emit(eventData);
}

function next_question({
    username,
    teamId,
    matchInstanceId,
    timestampCreated,
    questionId
}){
    const eventData = cloneDeep(eventStructure);
    eventData.event.type = "NEXT_QUESTION";
    eventData.event.context.matchSpec.teamId = teamId;
    eventData.event.context.matchSpec.matchInstanceId = matchInstanceId;
    eventData.event.context.matchSpec.timestampCreated = timestampCreated;
    eventData.event.data.username = username;
    eventData.event.data.questionId = questionId;
    console.log("event to be emitted is", eventData);
    webSocketClient.emit(eventData);
}

function submit_quiz({
    username,
    teamId,
    matchInstanceId,
    timestampCreated
}){
    const eventData = cloneDeep(eventStructure);
    eventData.event.type = "SUBMIT_QUIZ";
    eventData.event.context.matchSpec.teamId = teamId;
    eventData.event.context.matchSpec.matchInstanceId = matchInstanceId;
    eventData.event.context.matchSpec.timestampCreated = timestampCreated;
    eventData.event.data.username = username;
    console.log("event to be emitted is", eventData);
    webSocketClient.emit(eventData);
}

function listen(eventType){
    return webSocketClient.listen("message").pipe(
        filter(event=>event.type === eventType)
    );
    // return new Observable((subscriber)=>{
    //     webSocketClient.listen("message",(messageData)=>{
    //         if(messageData.type === eventType){
    //             subscriber.next(messageData);
    //         }
    //     });
    // });

} //return type would be { stream: obs, onClose: obs, onOpen: obs}

function getInGameData(data){
    return {
        matchInstanceData: cloneDeep(data.matchInstance.matchInstanceData),
        teamData: cloneDeep(data.matchInstance.teamData),
        triviaData: cloneDeep(data.matchInstance.triviaData),
        questionsData: cloneDeep(data.matchInstance.questionsData),
    };
}

export {
    introduce,
    join_game,
    start_game,
    mark_answer,
    update_score,
    next_question,
    submit_quiz,
    listen,
    getInGameData
};