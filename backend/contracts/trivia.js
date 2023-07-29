[
    {
        id: "trivia 1",
        questions: [
            "1",
            "2",
            "3"
        ], // The array order is considered as order of execution during match
        tags: {
            "category": "science",
            "subcategory": "physics",
            "difficulty": "easy"
        }, //category, subcategory, difficulty - mandatory tags
        time_limit: 30,
        leaderboard: ['1'],
        start_time: Date.now(),//timestamp of the start time -> can convert it to human readable date format later
        maxPoints: 15
    },
    {
        id: "trivia 2",
        questions: [
            "1",
            "2",
            "3"
        ], // The array order is considered as order of execution during match
        tags: {
            "category": "maths",
            "subcategory": "integration",
            "difficulty": "easy"
        }, //category, subcategory, difficulty - mandatory tags
        time_limit: 30,
        leaderboard: ['1'],
        start_time: Date.now(), //timestamp of the start time -> can convert it to human readable date format later
        maxPoints: 15

    },
    {
        id: "trivia 3",
        questions: [
            "3",
            "4",
            "5"
        ], // The array order is considered as order of execution during match
        tags: {
            "category": "science",
            "subcategory": "physics",
            "difficulty": "easy"
        }, //category, subcategory, difficulty - mandatory tags
        time_limit: 30,
        leaderboard: ['1'],
        start_time: Date.now(), //timestamp of the start time -> can convert it to human readable date format later
        maxPoints: 15

    }
]