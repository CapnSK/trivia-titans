import "./chat.css";
import { useState, useContext, useEffect, useRef, useCallback } from "react";
import { FontAwesomeIcon, fa } from "@fortawesome/react-fontawesome";
import { faComment, faCommentSlash, faListDots, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { ChatContext } from "../../contexts";
import { Typography } from "@mui/material"
import {TextBubble} from "./TextBubble/textbubble";

function Chat() {
    const [chatInstance, setChatInstance] = useState([]);
    const [showChatBox, setShowChatBox] = useState(false);
    const [showRecipient, setShowRecipient] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const socket = useRef(null);
    
    const [userInput, setUserInput] = useState({
        message: "",
        recipient: undefined
    });
    let { email, teamMates, teamName, username, teamId, setChatContext  } = useContext(ChatContext);
    console.log(teamId)
    const [chatMembers, setChatMembers] = useState(teamMates);
    //To test chat component uncomment below hook
    // useEffect(()=>{
    //     setChatContext({
    //         email: "kulkarnisankalp21@gmail.com",
    //         teamMates: [
    //             //will be populated as new people join the chat
    //         ],
    //         teamName: "titans",
    //         username: "cooldude69_"+(Math.round(Math.random()*10)),
    //         teamId: "teamTitans1221"
    //     });
    // }, []);

    const onSocketOpen = useCallback(()=>{
        setIsConnected(true);
        socket.current?.send(JSON.stringify({
            action:"setName",
            name: username,
            teamId: teamId
        }));
    }, [username, teamId]);

    const onSocketClose = useCallback(() =>{
        setIsConnected(false);
    }, [])

    const onSocketMessage = (rawData)=> {
        const data = JSON.parse(rawData);
        console.log("recieved message from socket as ",data);
        if(data.members){
            setChatMembers(data.members.map(name =>({username:name})));
        }
        //chat history was requested by user
        if(Array.isArray(data)){
            setChatInstance(data);
        }

        if(data.sender && data.receiver && data.value){
            setChatInstance((oldChatValue)=>{
                return [
                    ...oldChatValue,
                    {
                        ...data
                    }
                ]
            });
        }
    }

    const sendMessage = () => {
        console.log(userInput);
        setUserInput((oldUserInput)=>{
            return {
                ...oldUserInput,
                message: ""
            };
        });
        socket.current?.send(JSON.stringify({
            action: userInput.recipient === "ALL" ? "sendPublic": "sendPrivate",
            message: userInput.message,
            to: userInput.recipient !== "ALL" ? userInput.recipient : undefined,
            teamId: teamId
        }));

        setTimeout(()=>{
            socket.current?.send(JSON.stringify({
                action: "getChatHistory",
                teamId: teamId
            }));
    
        }, 500);
    }

    useEffect(()=>{
        if(username && teamId){
            if(socket.current?.readyState !== WebSocket.OPEN){
                socket.current = new WebSocket(`${process.env.REACT_APP_WS_APIGATEWAY_URL}`);
                socket.current.addEventListener("open", onSocketOpen);
                socket.current.addEventListener("close", onSocketClose);
                socket.current.addEventListener("message", (event)=>{
                    onSocketMessage(event.data);
                });
            }
        }
    }, [username, teamMates, teamId]);

    const toggleChatBubble = () => {
        setShowChatBox((oldshowChatBoxValue)=>{
            return !oldshowChatBoxValue;
        });
    }

    const handleUserInputChange = (e) => {
        setUserInput((oldUserInput)=>{
            return {...oldUserInput, message: e.target.value };
        });
    }

    const handleRecipientChange = (username) => {
        setUserInput((oldUserInput)=>{
            return {...oldUserInput, recipient: username };
        });
        toggleRecipientOverlay();
    }

    const toggleRecipientOverlay = () => {
        setShowRecipient((oldshowRecipientValue)=>{
            return !oldshowRecipientValue;
        });
    }

    return (
        <>
            <div className="outer-wrapper">
                <div className="chat-bubble" onClick={toggleChatBubble}>
                    <FontAwesomeIcon icon={faComment} color="white" size="2x"/>
                </div>
                <div className={`chat-container ${showChatBox ? "show":"hide"}`}>
                    <div className="inner-container">
                        <div className="chat-header">
                                    <Typography variant="body2" color="white" style={{marginTop: "0.8em"}}>
                                    {
                                        !(email && teamName && username) ? 
                                        "Please login & join team to start interacting with people"
                                        : `Hi ${username}, you can interact with your teammates here`
                                    }          
                                    </Typography>
                                
                        </div>
                        {(email && teamName && username) ? 
                        (
                            <>
                                <div className="chat-thread-wrapper">
                                    <div className="chat-thread">
                                        {/* <TextBubble sender={"Dopa"} recipient={"public"} message={" Angel Adept Blind Bodice Clique Coast Dunce Docile Enact Eosin Furlong Focal Gnome Gondola Human Hoist Inlet Iodine Justin Jocose Knoll Koala Linden Loads Eosin Furlong Focal Gnome Gondola Human Hoist Inlet Iodine Justin Jocose Knoll Koala Linden Loads"}/>
                                        <TextBubble sender={"Dopa"} recipient={"Dopa"} message={"sample message"}/> */}
                                        {
                                            chatInstance && chatInstance.length && (
                                                <>
                                                    {chatInstance.map((unitChatInstance)=>{
                                                        return (
                                                            <>
                                                                <TextBubble sender={unitChatInstance.sender} recipient={unitChatInstance.receiver} message={unitChatInstance.value}/>
                                                            </>
                                                        );
                                                    })}
                                                </>
                                            )
                                        }
                                    </div>
                                </div>
                                <div className="chat-input">
                                    <input type="text" onChange={handleUserInputChange} value={userInput.message}></input>
                                    <>
                                        {showRecipient && (
                                            <>
                                                <div className="recipient-overlay">
                                                <Typography className={`item ${userInput.recipient === "ALL" ? "active" : ""}`} onClick={()=>handleRecipientChange("ALL")} variant="body2" color="black" style={{marginTop: "0.8em"}}>
                                                    All
                                                </Typography>
                                                    {chatMembers?.map(teammate=>{
                                                        return (
                                                            <>
                                                            <Typography className={`item ${userInput.recipient === teammate.username ? "active" : ""}`} onClick={()=>handleRecipientChange(teammate.username)} variant="body2" color="black" style={{marginTop: "0.8em"}}>
                                                                {teammate.username}
                                                            </Typography>
                                                            </>
                                                        );
                                                    })}
                                                </div>
                                            </>
                                        )}
                                    </>
                                    <FontAwesomeIcon onClick={toggleRecipientOverlay} style={{marginLeft: "0.4em", marginTop: "0.2em", cursor:"pointer"}} icon={faListDots} color="gray" size="1x"/>
                                    <FontAwesomeIcon onClick={sendMessage} style={{marginLeft: "1em", marginTop: "0.2em", cursor:"pointer"}} icon={faArrowRight} color="gray" size="1x"/>
                                </div>
                            </>
                        ) : 
                        (
                            
                                <div className="chat-disabled">
                                    <FontAwesomeIcon icon={faCommentSlash} color="gray" size="5x"/>
                                </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Chat;

// const URL = `${process.env.REACT_APP_WS_APIGATEWAY_URL}`;
// console.log(URL);
// try {
//     webSocketClient.create({
//         URL,
//         onOpen: (c) => {
//             try {
//                 console.log("connection opened", c);
//                 webSocketClient.sendMessage({
//                     action: "sendMessage",
//                     data: "First web socket message sent"
//                 });
//             } catch (e) {
//                 console.log(e);
//             }
//         },
//         onClose: (c) => console.log("connection closed", c)
//     });
// } catch (e) {
//     console.log(e);
// }