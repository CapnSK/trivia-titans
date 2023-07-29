const chatHistory = [];

const sendMessage = async (client, ids, message) => {
    if(ids && client && message){
        chatHistory.push({
            sender: getSender(message),
            receiver: getReceiver(message, ids),
            timestamp: Date.now()
        });
        for(let id of ids){
            try{
                await client.postToConnection({
                    "ConnectionId": id,
                    "Data": Buffer.from(JSON.stringify(message))
                });
            } catch(e){
                console.log("error trying to send message to id "+id, e);
            }
        }
    }
}

const sendChatHistory = async (username, connectionId) => {
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
                "Data": Buffer.from(JSON.stringify(chatHistory))
            });
        } catch(e){
            console.log("error sending message to id "+connectionId,e);
        }
    }
}


const getSender = (message) => {
    let sender;
    if(message["systemMessage"]){
        sender = "system";
    } else if(message["userMessage"]){
        sender = Object.keys(message["userMessage"]).find(key => key !== "messageType");
    }
    return sender;
}

const getReceiver = (message, ids) => {
    let receiver;
    if(message["systemMessage"]){
        receiver = "ALL";
    } else if(message["userMessage"]){
        receiver = message.messageType === "private" ? ids[0] : "ALL";
    }
    return receiver;
} 

export {sendMessage,sendChatHistory};