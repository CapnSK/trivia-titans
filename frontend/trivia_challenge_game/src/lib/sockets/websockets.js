import { Observable, finalize } from "rxjs";

class WebSocketAPI {
    constructor(URL, onOpen, onClose, onEventListenerRemoved){
        if(URL){
            this.create({URL, onOpen, onClose, onEventListenerRemoved});
        }
    }

    create({URL, onOpen, onClose, onEventListenerRemoved}){
        if(URL){
            this._webSocket = new WebSocket(URL);
            this.addOnOpenListener(onOpen);
            this.addOnCloseListener(onClose);
            this.addOnEventClosedListener(onEventListenerRemoved);
        }
    }

    listen(topicName){
        return new Observable((subscriber)=>{
            this._webSocket.addEventListener(topicName, (event)=>{
                subscriber.next(event);
            });
        }).pipe(
            finalize(()=>{
                this._webSocket.removeEventListener(topicName, this.onEventListenerRemoved);
            })
        );
    }

    addOnOpenListener(onOpen){
        this._webSocket.onopen = onOpen;
    }

    addOnCloseListener(onClose){
        this._webSocket.onclose = onClose
    }

    addOnEventClosedListener(onEventListenerRemoved){
        this.onEventListenerRemoved = onEventListenerRemoved;
    }

    // sendMessage(message){
    //     this._webSocket.current?.
    // }
}

const webSocketClient = new WebSocketAPI();

export default webSocketClient;