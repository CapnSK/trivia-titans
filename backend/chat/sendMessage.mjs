const sendMessage = async (client, ids, message) => {
    if(ids && client && message){
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

export default sendMessage;