import { Observable, finalize } from "rxjs";
import { map, tap } from "rxjs/operators";

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

    listen(topicName){ //topicName e.g. open, close, message etc.
        return new Observable((subscriber)=>{
            this._webSocket.addEventListener(topicName, (event)=>{
                subscriber.next(event);
            });
        }).pipe(
            map(data=> data.data),
            tap(data => console.log("received data from websocket as", data)),
            map(data=> JSON.parse(data)),
            tap(data => console.log("parsed data is", data)),
            finalize(()=>{
                this._webSocket.removeEventListener(topicName, this.onEventListenerRemoved);
            })
        );
    }

    emit(event){
        this._webSocket.send(JSON.stringify(event));
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

const webSocketClient = new WebSocketAPI(process.env.REACT_APP_WS_INGAME_APIGATEWAY_URL);

export  { webSocketClient };