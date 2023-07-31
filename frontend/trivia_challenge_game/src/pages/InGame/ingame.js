import "./ingame.css";
import { useEffect } from "react";
import { listen as listenToEvent  } from "../../util"
import { take } from "rxjs/operators";

const InGame = () =>{

    const emitEvent = () => {
        
    }

    useEffect(()=>{
        listenToEvent("START_GAME").pipe(
            take(1)
        ).subscribe({
            complete: ()=>{
                
            },
            error: (e)=>{
                console.log("error occurred while fetching game event", e);
            },
            next: (data)=>{
                console.log("recieved data as ", data);
            }
        })
    }, []);

    return (
        <>
            In Game Page
            <button onClick={emitEvent}></button>
        </>
    );
}

export default InGame;