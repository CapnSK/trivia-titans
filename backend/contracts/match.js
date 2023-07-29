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
            currentQuestion: 1, // question number based on the index
            answers:{
                questionId: "1", //question being referred
                answerOptionId: "2" // answer given by the team
            },  
        }, 
    }
]


// trivia id? --  get from the lambda/ cloud fn that is handling trivia

