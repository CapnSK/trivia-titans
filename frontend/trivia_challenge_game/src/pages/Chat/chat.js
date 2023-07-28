import "./chat.css";

function Chat() {
    return (<>
        <div className="chat-bubble"><div><i className='fa fa-comments'></i> Chat</div></div>
    </>)
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