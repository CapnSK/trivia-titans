const chatHistory = [];

const sendMessage = async (client, ids, message, names) => {
    if(ids && client && message){
        if(getSender(message) && getReceiver(message, ids, names) && getMessageBody(message)){
            chatHistory.push({
                sender: getSender(message),
                receiver: getReceiver(message, ids, names),
                timestamp: Date.now(),
                value: getMessageBody(message)
            });
        }
        console.log(chatHistory);
        for(let id of ids){
            try{
                await client.postToConnection({
                    "ConnectionId": id,
                    "Data": Buffer.from(JSON.stringify(message.members ? message : chatHistory[chatHistory.length-1]))
                });
            } catch(e){
                console.log("error trying to send message to id "+id, e);
            }
        }
    }
}

const sendChatHistory = async (client, username, connectionId) => {
    if(username){
        const userSpecificChatHistory = chatHistory.filter(chat=>{
            if(chat.sender === username || chat.sender === "system" || chat.receiver === "ALL" || chat.receiver === username){
                return true;
            }
            return false;
        });
        try{
            await client.postToConnection({
                "ConnectionId": connectionId,
                "Data": Buffer.from(JSON.stringify(userSpecificChatHistory))
            });
        } catch(e){
            console.log("error sending message to id "+connectionId,e);
        }
    }
}


const getSender = (message) => {
    let sender;
    console.log("entering inside getSender with message",message)
    if(message["systemMessage"]){
        sender = "system";
    } else if(message["userMessage"]){
        console.log("sender message.userMessage.keys are", Object.keys(message["userMessage"]));
        console.log("sender message.userMessage.keys.find is", Object.keys(message["userMessage"]).find(key => key !== "messageType"));
        sender = Object.keys(message["userMessage"]).find(key => key !== "messageType");
    }
    return sender;
}

const getReceiver = (message, ids, names) => {
    let receiver;
    console.log("entering inside getReceiver with message & ids",message, ids)
    if(message["systemMessage"]){
        receiver = "ALL";
    } else if(message["userMessage"]){
        console.log("receiver message.messageType is", message["userMessage"].messageType);
        receiver = message["userMessage"].messageType === "private" ? names[ids[0]] : "ALL";
        console.log("receiver  is", receiver);
    }
    return receiver;
}

const getMessageBody = (message) => {
    let messageBody;
    console.log("entering inside getMessageBody with message",message);
    if(message["systemMessage"]){
        messageBody = message["systemMessage"];
    } else if(message["userMessage"]){
        console.log("body message.userMessage.keys are", Object.keys(message["userMessage"]));
        console.log("body message.userMessage.keys.find is", Object.keys(message["userMessage"]).find(key => key !== "messageType"));
        const key = Object.keys(message["userMessage"]).find(key => key !== "messageType");
        messageBody = message["userMessage"][key];
        console.log("message  is", messageBody);
    }
    return messageBody;
}

export {sendMessage,sendChatHistory};