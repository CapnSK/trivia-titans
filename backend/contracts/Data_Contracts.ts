type team = {
    id: string,
    name: string,
    timestamp_created: string,
    admin: {
        username: string,
        email: string
    },
    members:Array<{
        username: string,
        email: string
        status: "PENDING" | "CONFIRMED" | "REJECTED"
    }>,
    //status: "ACTIVE" | "INACTIVE"//"PENDING_CONFIRMATION"| "CONFIRMED" | "COMPLETE" | "ABANDONED"
};

type question = {
    id: string,
    label: string,
    options:Array<{
        id: string,
        label: string
    }>
    answers:Array<string> | string //multi select or single correct answer out of all the options
    tags: {
        [key: string]: string
    } // difficulty, hints, category, subcategory - mandatory tags
    points: number //points for a question out of 1 or 5
    time_limit: number,
    start_time: string, //timestamp of the start time when the question was requested by client
};

// tags{
//     category:"Computer Science",
//     difficulty: "HARD",
//     subcategory: "DSA"
// }

type trivia = {
    id: string,
    questions: Array<question>, // The array order is considered as order of execution during match
    tags: {
        [key: string]: string
    }, //category, subcategory, difficulty - mandatory tags
    time_limit: number,
    leaderboard: Array<leaderboard_item>,
    start_time: string, //timestamp of the start time -> can convert it to human readable date format later
};

type leaderboard_item = {
    team_id: string,
    team_name: string,
    players: Array<{
        id: string,
        name: string
    }>,
    score: number
    match_instance_id: string
};

type match = {
    match_instance_id: string,
    timestamp_created: string,
    match_status: "IN_LOBBY" | "IN_PROGRESS" | "COMPLETED" | "ABANDONED",
    team: team, //does not store entire team instance, but just a team_id
    score: number, //score till now
    // team1: {
    //     team: team,
    //     score: number
    // },
    // team2: {
    //     team: team,
    //     score: number
    // },
    match_config: {
        trivia_id: string,
        currentQuestion: number, // question number currently everyone should be at
        answers:Array<{
            questionId: string, //question being referred
            answerOptionId: string // answer given by the team
        }>
    }, //does not store entire team instance, but just a team_id
    // leaderboard: Array<leaderboard_item>
};