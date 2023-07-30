type INGAME_EVENT_TYPES = "INTRODUCE" | "JOIN_GAME" | "START_GAME" | "MARK_ANSWER" | "UPDATE_SCORE" | "NEXT_QUESTION";

type event = {
    type: INGAME_EVENT_TYPES,
    context: introduce_event_context | join_game_context | start_game_context,
    data: introduce_event_data | join_game_data | start_game_data
}

type introduce_event_context = {
    "matchSpec": {
        teamId: string,
        triviaId: string,
    }
}

type introduce_event_data = {
    username: string,
}



type join_game_context = {
    "matchSpec": introduce_event_context["matchSpec"] & {
        matchInstanceId: string,
    }
}

type join_game_data = introduce_event_data & {
    startTime: EpochTimeStamp
}

type start_game_context = join_game_context & {};

type start_game_data = {
    //no  data needed as such rn since all data will be there in either context or ui & only tapping on the event would be required
    username: string
}

type mark_answer_context = start_game_context & {
    matchTimestamp: string //needed because match table has sort key for that
}

type mark_answer_data = {
    questionId: string,
    selectedOption: string
}

type next_question_data = {
    questionId: string;
}