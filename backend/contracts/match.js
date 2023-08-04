[
    {
        match_instance_id: "1",
        timestamp_created: Date.now(),
        match_status: "IN_LOBBY", // "IN_LOBBY" | "IN_PROGRESS" | "COMPLETED" | "ABANDONED",
        team: "1", //does not store entire team instance, but just a team_id
        score: "15", //score till now
        win: false,
        match_config: {
            trivia_id: "trivia 1",
            current_question: 1, // question number based on the index
            answers:{
                question_id: "answer_option_id", //question being referred
                //"1": "2" 
            }
        }, //does not store entire team instance, but just a team_id
        // leaderboard: Array<leaderboard_item>
    }
]


// trivia id? --  get from the lambda/ cloud fn that is handling trivia

