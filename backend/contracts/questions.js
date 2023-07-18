[
    {
        id: "1",
        label: "what is 2x5???",
        options:[
            {
                id: "option 1",
                label: "10"
            },
            {
                id: "option 2",
                label: "2"
            },
            {
                id: "option 3",
                label: "4"
            },
        ],
        answers: ["option 1"], //multi select or single correct answer out of all the options
        tags: {
            "difficulty": "easy",
            "hints": "5+5",
            "category": "maths",
            "subcategory": "multiplication"
        }, // difficulty, hints, category, subcategory - mandatory tags
        points: 1, //points for a question out of 1 or 5
        time_limit: 30,
        start_time: Date.now(), 
    },
    {
        id: "1",
        label: "what is 2x5???",
        options:[
            {
                id: "option 1",
                label: "10"
            },
            {
                id: "option 2",
                label: "2"
            },
            {
                id: "option 3",
                label: "4"
            },
        ],
        answers: ["option 1"], //multi select or single correct answer out of all the options
        tags: {
            "difficulty": "easy",
            "hints": ["5+5"],
            "category": "maths",
            "subcategory": "multiplication"
        }, // difficulty, hints, category, subcategory - mandatory tags
        points: 1, //points for a question out of 1 or 5
        time_limit: 30,
        start_time: Date.now(), 
    },
    {
        id: "2",
        label: "what is 2+5???",
        options:[
            {
                id: "option 1",
                label: "5"
            },
            {
                id: "option 2",
                label: "7"
            },
            {
                id: "option 3",
                label: "3"
            },
        ],
        answers: ["option 2"], //multi select or single correct answer out of all the options
        tags: {
            "difficulty": "easy",
            "hints": ["10-3"],
            "category": "maths",
            "subcategory": "addition"
        }, // difficulty, hints, category, subcategory - mandatory tags
        points: 1, //points for a question out of 1 or 5
        time_limit: 30,
        start_time: Date.now(), 
    },
    {
        id: "3",
        label: "who is the PM???",
        options:[
            {
                id: "option 1",
                label: "Justin"
            },
            {
                id: "option 2",
                label: "Modi"
            },
            {
                id: "option 3",
                label: "ME"
            },
        ],
        answers: ["option 1"], //multi select or single correct answer out of all the options
        tags: {
            "difficulty": "easy",
            "hints": ["India"],
            "category": "General Knowledge",
            "subcategory": "Politics"
        }, // difficulty, hints, category, subcategory - mandatory tags
        points: 1, //points for a question out of 1 or 5
        time_limit: 30,
        start_time: Date.now() 
    }
]