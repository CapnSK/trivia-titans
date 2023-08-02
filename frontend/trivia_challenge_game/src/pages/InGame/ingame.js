import "./ingame.css";
import { useEffect } from "react";
import { introduce, join_game, listen as listenToEvent, start_game  } from "../../util"
import { take } from "rxjs/operators";

const InGame = () =>{

    const emitEvent = () => {
        introduce({
            username: "Jamura",
            teamId: "triviaTitans1221",
        });
        setTimeout(()=>{
            join_game({
                matchInstanceId: "t011223",
                teamId: "triviaTitans1221",
                timestampCreated: "1689012982155",
                username: "Jamura"
            });
        }, 2000);
        setTimeout(()=>{
            start_game({
                matchInstanceId: "t011223",
                teamId: "triviaTitans1221",
                timestampCreated: "1689012982155",
                username: "Jamura"
            });
        }, 6000);
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
            <button onClick={emitEvent}>Join Game</button>
        </>
    );
}

export default InGame;