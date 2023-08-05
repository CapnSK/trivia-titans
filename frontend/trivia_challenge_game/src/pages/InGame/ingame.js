import "./ingame.css";
import { Typography, Checkbox, Button } from "@mui/material"
import { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
    introduce as emitIntroduceEvent, 
    join_game as emitJoinGameEvent, 
    listen as listenToEvent, 
    start_game as emitStartGameEvent, 
    next_question as emitNextQuestionEvent,
    mark_answer as emitMarkAnswerEvent  ,
    update_score as emitUpdateScoreEvent,
    submit_quiz as emitSubmitQuiz
} from "../../util"
import { Subject } from "rxjs";
import { take, takeUntil } from "rxjs/operators";
import { AuthContext } from "../../contexts";
import { InGameContext } from "../../contexts"
import { cloneDeep } from "lodash";

const playModes = {
    LEADER: 1,
    MEMBER: 2
}

const unsubscribe = new Subject();

const InGame = () =>{
    console.log("inside in-game component");
    // const [matchData, setMatchData] = useState({
    //     matchInstanceData: undefined,
    //     teamData: undefined,
    //     triviaData: undefined,
    //     questionsData: undefined
    // });
    const { matchInstanceData, teamData, questionsData, triviaData }  = useContext(InGameContext);
    const [timerValue, setTimerValue] = useState(0);

    //const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [currQuestionId, setCurrQuestionId] = useState("");
    const [questionLabel, setQuestionLabel] = useState("");
    const [questionOptions, setQuestionOptions] = useState([]);
    // const [lastQuestion, setLastQuestion] = useState(false);
    const [selectedOptionId, setSelectedOptionId] = useState([]);
    const [score, setScore] = useState("0");

    const [gameStarted, setGameStarted] = useState(false);
    const [playMode, setPlayMode] = useState(()=>playModes.MEMBER); //mode - playModes.LEADER, playModes.MEMBER
    const { username: loggedInUsername } = useContext(AuthContext);
    // const stateDataRef = useRef(state);
    const navigate = useNavigate();

    // const startGameCallback = useCallback(()=>{
    //     if(gameStarted){
    //         startGame();
    //     }
    // }, [gameStarted])
    // useEffect(()=>{
    //     if(state.data){
    //         console.log("setting in game context")
    //         setInGameContext({
    //             matchInstanceData: cloneDeep(state.data.matchInstance.matchInstanceData),
    //             teamData: cloneDeep(state.data.matchInstance.teamData),
    //             triviaData: cloneDeep(state.data.matchInstance.triviaData),
    //             questionsData: cloneDeep(state.data.matchInstance.questionsData),
    //         });
    //     }
    //     console.error("setting state data reference")
    // }, [state.data, state.data.matchInstance.matchInstanceData, state.data.matchInstance.teamData, state.data.matchInstance.triviaData, state.data.matchInstance.questionsData]);

    useEffect(()=>{
        if(triviaData?.start_time){
            const startTime = new Date(triviaData.start_time).getTime();
            const currentTime = new Date(Date.now()).getTime();
            // const timeRemaining = Math.max(Math.round(startTime - currentTime),0); 
            const timeRemaining = 5; 
            setTimerValue(timeRemaining);
            const intervalId = setInterval(()=>{
                setTimerValue((oldValue)=>{
                    if(oldValue-1 <= 0){
                        clearInterval(intervalId);
                        //startGame();
                        setGameStarted(true);
                    }
                    //console.log("old timer value inside setter is", oldValue);
                    return oldValue > 0 ? oldValue-1 : oldValue;
                });
                //console.log("current timer value is", timerValue);
            }, 1000);
            
            return () => {
                clearInterval(intervalId);
            }
        }
    }, [triviaData?.start_time]);

    useEffect(()=>{
        if(gameStarted){
            initiateGame();
        }
    }, [gameStarted]);

    const emitEvent = () => {
        emitIntroduceEvent({
            username: "capsk",
            teamId: "1",
        });
        setTimeout(()=>{
            emitJoinGameEvent({
                matchInstanceId: "mt2",
                teamId: "1",
                timestampCreated: "1689012982155",
                username: "capsk"
            });
        }, 2000);
        setTimeout(()=>{
            emitStartGameEvent({
                matchInstanceId: "mt2",
                teamId: "1",
                timestampCreated: "1689012982155",
                username: "capsk"
            });
        }, 6000);
    }

    useEffect(()=>{
        listenToEvent("START_GAME").pipe(
            take(1),
            takeUntil(unsubscribe)
        ).subscribe({
            complete: ()=>{
                
            },
            error: (e)=>{
                console.error("error occurred while start game", e);
            },
            next: (data)=>{
                console.log("recieved data for start game as ", data);
                let mode = teamData?.admin?.username === loggedInUsername ? playModes.LEADER : playModes.MEMBER;
                setPlayMode(mode);
                if(mode === playModes.LEADER){
                    emitNextQuestionEvent({
                        username: loggedInUsername,
                        matchInstanceId: matchInstanceData?.match_instance_id,
                        timestampCreated: matchInstanceData?.timestamp_created,
                        teamId: matchInstanceData?.team_id,
                        questionId: triviaData?.questions[0]
                    });
                }
            }
        });

        listenToEvent("JOIN_GAME").pipe(
            take(1),
            takeUntil(unsubscribe)
        ).subscribe({
            complete: ()=>{
                
            },
            error: (e)=>{
                console.error("error occurred while join game", e);
            },
            next: (data)=>{
                console.log("recieved data for join game as ", data);
            }
        });

        listenToEvent("NEXT_QUESTION").pipe(
            takeUntil(unsubscribe)
        ).subscribe({
            complete: ()=>{
                
            },
            error: (e)=>{
                console.error("error occurred while next question", e);
            },
            next: (event)=>{
                console.log("recieved data for next question ", event);
                const nextQId = event.data.questionId;
                const [index, question] = getQuestionDetailsFromId(nextQId);
                console.log("question is", question);
                setQuestionLabel(question.label);
                setCurrQuestionId(nextQId);
                setQuestionOptions(question.options);
                // if(question.time_limit){
                //     setTimerValue(question.time_limit);
                // }
                // if(index === matchData?.questionsData.length-1){
                //     nextQuestionSubscription.unsubscribe();
                // }
            }
        });
        
        listenToEvent("MARK_ANSWER").pipe(
            takeUntil(unsubscribe)
        ).subscribe({
            complete: ()=>{
                
            },
            error: (e)=>{
                console.error("error occurred while mark answer", e);
            },
            next: (event)=>{
                console.log("recieved data for mark answer ", event);
                const questionId = event.data?.questionId;
                const answerOptionId = event.data?.answerId;

                if(questionId && answerOptionId){
                    setSelectedOptionId(answerOptionId);
                }
            }
        });

        listenToEvent("UPDATED_SCORE").pipe(
            takeUntil(unsubscribe)
        ).subscribe({
            complete: ()=>{
                
            },
            error: (e)=>{
                console.error("error occurred while update score", e);
            },
            next: (event)=>{
                console.log("recieved data for update score ", event);
                const updatedScore = event.data?.updatedScore;
                if(updatedScore !== undefined){
                    setScore(updatedScore);
                }
            }
        });

        listenToEvent("QUIZ_SUBMITTED").pipe(
            takeUntil(unsubscribe)
        ).subscribe({
            complete: ()=>{
                
            },
            error: (e)=>{
                console.error("error occurred while submit quiz", e);
            },
            next: (event)=>{
                console.log("recieved data for submit quiz ", event.data.score);
                alert("Game submitted, Your final score is: "+ event.data.score);
                navigate("/home",{relative: false});
            }
        });

        return ()=>{
            unsubscribe.next();
        }
    }, []);

    useEffect(()=>{
        let mode = teamData?.admin?.username === loggedInUsername ? playModes.LEADER : playModes.MEMBER;
        setPlayMode(mode);
        console.log("play mode", mode)
    }, [teamData?.admin, loggedInUsername]);


    const initiateGame = () => {
        console.log("game started");
        let mode = teamData?.admin?.username === loggedInUsername ? playModes.LEADER : playModes.MEMBER;
        setPlayMode(mode);
        console.log("play mode", mode)
        //console.log("emitting event", matchData)
        if(mode === playModes.LEADER){
            emitStartGameEvent({
                username: loggedInUsername,
                matchInstanceId: matchInstanceData?.match_instance_id,
                timestampCreated: matchInstanceData?.timestamp_created,
                teamId: matchInstanceData?.team_id
            });
            // if(matchData?.triviaData?.questions?.length){
            // }
        }
    }

    const getQuestionDetailsFromId = (questionId) => {
        let question, index;
        if(questionsData){
            index = questionsData.findIndex((q)=>{
                return q.id === questionId;
            });
            question = questionsData[index];
        }
        return [index, question];
    }

    const handleOptionSelection = (optionId, checked) => {
        if(playMode === playModes.LEADER){
            // selectedOptionId.indexOf(optionId) !== -1 && !checked ? 
            const selectedOptionIdCopy = cloneDeep(selectedOptionId);
            if(selectedOptionIdCopy.indexOf(optionId) !== -1 && !checked){
                selectedOptionIdCopy.splice(selectedOptionIdCopy.indexOf(optionId) , 1);
            }
            if(selectedOptionIdCopy.indexOf(optionId) === -1 && checked){
                selectedOptionIdCopy.push(optionId);
            }
            console.log("selected options list is", selectedOptionIdCopy);
            emitMarkAnswerEvent({
                username: loggedInUsername,
                teamId: matchInstanceData?.team_id,
                matchInstanceId: matchInstanceData?.match_instance_id,
                timestampCreated: matchInstanceData?.timestamp_created,
                questionId: currQuestionId,
                selectedOption: selectedOptionIdCopy
            });
        }
    }

    const handleUpdateScore = () => {
        //emitUpdate
        if(playMode === playModes.LEADER){
            emitUpdateScoreEvent({
                username: loggedInUsername,
                matchInstanceId: matchInstanceData?.match_instance_id,
                timestampCreated: matchInstanceData?.timestamp_created,
                teamId: matchInstanceData?.team_id
            });
        }
    }

    const handleNextQorSubmit = () => {
        if(playMode === playModes.LEADER){
            const [idx, question] = getQuestionDetailsFromId(currQuestionId);
            console.log("idx and questions len is", idx, triviaData?.questions?.length)
            if(idx+1 < triviaData?.questions?.length){
                emitNextQuestionEvent({
                    username: loggedInUsername,
                    matchInstanceId: matchInstanceData?.match_instance_id,
                    timestampCreated: matchInstanceData?.timestamp_created,
                    teamId: matchInstanceData?.team_id,
                    questionId: triviaData?.questions[idx+1]
                });
            } 
            //it was a last question submit the quiz entirely
            else {
                emitSubmitQuiz({
                    username: loggedInUsername,
                    matchInstanceId: matchInstanceData?.match_instance_id,
                    timestampCreated: matchInstanceData?.timestamp_created,
                    teamId: matchInstanceData?.team_id
                });
            }
        }
    }


    return (
        <>
            <div className="timer-box">{timerValue}</div>
            <div className="main-game-box">
                {/* <button onClick={emitEvent}>Join Game</button> */}

                {gameStarted && (
                    <>
                        <div className="inner-question-container">
                        <Typography variant="body1">{questionLabel}</Typography>
                        {questionOptions?.map(option=>{
                            return (
                                <>
                                    <div className="cb-container">
                                        <Checkbox
                                            disabled={playMode === playModes.MEMBER} 
                                            onChange={(e)=>{handleOptionSelection(option.id, e.target.checked || false)}} 
                                            checked={selectedOptionId.includes(option.id)} 
                                            label={option.label || "dummy label"} />
                                        <Typography variant="subtitle1">{option.label}</Typography>
                                    </div>
                                </>
                            );  
                        })}
                    </div>

                    <div className="buttons-container">
                        <Button onClick={handleUpdateScore} variant="contained" style={{marginRight: "1em"}}>MARK</Button>
                        <Button onClick={handleNextQorSubmit} variant="contained" color="secondary">{getQuestionDetailsFromId(currQuestionId)[0] === questionsData?.length-1 ? "SUBMIT" : "Next Question"}</Button>
                    </div>
                    
                    </>
                )}
                {
                    !gameStarted && (
                        <>
                            Please wait for the game to start...
                        </>
                    )
                }
            </div>
        </>
    );
}

export default InGame;