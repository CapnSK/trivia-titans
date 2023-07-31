import { Observable } from "rxjs";
import { webSocketClient } from "../lib/sockets/";

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
    eventStructure.event.type = "INTRODUCE";
    eventStructure.event.context.matchSpec.teamId = teamId;
    eventStructure.event.data.username = username;
    console.log("event to be emitted is", eventStructure);
    webSocketClient.emit(eventStructure);
}

function join_game({
    username,
    teamId,
    matchInstanceId,
    timestampCreated
}){
    eventStructure.event.type = "JOIN_GAME";
    eventStructure.event.context.matchSpec.teamId = teamId;
    eventStructure.event.context.matchSpec.matchInstanceId = matchInstanceId;
    eventStructure.event.context.matchSpec.timestampCreated = timestampCreated;
    eventStructure.event.data.username = username;
    console.log("event to be emitted is", eventStructure);
    webSocketClient.emit(eventStructure);
}

function start_game({
    username,
    teamId,
    matchInstanceId,
    timestampCreated
}){
    eventStructure.event.type = "START_GAME";
    eventStructure.event.context.matchSpec.teamId = teamId;
    eventStructure.event.context.matchSpec.matchInstanceId = matchInstanceId;
    eventStructure.event.context.matchSpec.timestampCreated = timestampCreated;
    eventStructure.event.data.username = username;
    console.log("event to be emitted is", eventStructure);
    webSocketClient.emit(eventStructure);
}

function mark_answer({
    username,
    teamId,
    matchInstanceId,
    timestampCreated,
    questionId,
    selectedOptionId
}){
    eventStructure.event.type = "MARK_ANSWER";
    eventStructure.event.context.matchSpec.teamId = teamId;
    eventStructure.event.context.matchSpec.matchInstanceId = matchInstanceId;
    eventStructure.event.context.matchSpec.timestampCreated = timestampCreated;
    eventStructure.event.data.username = username;
    eventStructure.event.data.questionId = questionId;
    eventStructure.event.data.selectedOptionId = selectedOptionId;
    console.log("event to be emitted is", eventStructure);
    webSocketClient.emit(eventStructure);
}

function update_score(
    {
    username,
    teamId,
    matchInstanceId,
    timestampCreated
}){
    eventStructure.event.type = "UPDATE_SCORE";
    eventStructure.event.context.matchSpec.teamId = teamId;
    eventStructure.event.context.matchSpec.matchInstanceId = matchInstanceId;
    eventStructure.event.context.matchSpec.timestampCreated = timestampCreated;
    eventStructure.event.data.username = username;
    console.log("event to be emitted is", eventStructure);
    webSocketClient.emit(eventStructure);
}

function next_question({
    username,
    teamId,
    matchInstanceId,
    timestampCreated,
    questionId
}){
    eventStructure.event.type = "NEXT_QUESTION";
    eventStructure.event.context.matchSpec.teamId = teamId;
    eventStructure.event.context.matchSpec.matchInstanceId = matchInstanceId;
    eventStructure.event.context.matchSpec.timestampCreated = timestampCreated;
    eventStructure.event.data.username = username;
    eventStructure.event.data.questionId = questionId;
    console.log("event to be emitted is", eventStructure);
    webSocketClient.emit(eventStructure);
}

function submit_quiz({
    username,
    teamId,
    matchInstanceId,
    timestampCreated
}){
    eventStructure.event.type = "SUBMIT_QUIZ";
    eventStructure.event.context.matchSpec.teamId = teamId;
    eventStructure.event.context.matchSpec.matchInstanceId = matchInstanceId;
    eventStructure.event.context.matchSpec.timestampCreated = timestampCreated;
    eventStructure.event.data.username = username;
    console.log("event to be emitted is", eventStructure);
    webSocketClient.emit(eventStructure);
}

function listen(eventType){
    return new Observable((subscriber)=>{
        webSocketClient.listen("message",(messageData)=>{
            if(messageData.type === eventType){
                subscriber.next(messageData);
            }
        });
    });

} //return type would be { stream: obs, onClose: obs, onOpen: obs}



export {
    introduce,
    join_game,
    start_game,
    mark_answer,
    update_score,
    next_question,
    submit_quiz,
    listen
};