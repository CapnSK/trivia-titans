import {React, useState} from 'react';

function Leaderboard(){

    const [src, setSrc] = useState();


    return (
        <div className="auth-inner-leaderboard"> 
            <div width= "100%">
            <h2 style={{textAlign:"center"}}>Leaderboard</h2>
            <br></br>
            <span>
                See how you stack up against other teams and users:
                <li>
                    You can see the total score of each team and user, as well as the number of games they have played and won. 
                </li>
                <li>
                    You can filter the leaderboard by team, user, or the category of the quiz. 
                </li>
                <li>
                    You can also sort the leaderboard by total score, number of games played, or number of games won.
                </li>
                <li>
                    You can drill down a team or a user to see all the categories they have played and further drill down to see the timestamp on when they played the game.
                </li>
            </span>
            <br></br>
            <strong style={{textAlign:"center"}}>Leaderboards are updated every 1 minute</strong>
            <br></br>
            {/* Two buttons: one for team leaderboards, and one for user leaderboards */}
            <div style={{textAlign:"right"}}>
                <button type="button" className="btn btn-primary" style={{marginRight:"2px"}} onClick={() => setSrc("https://lookerstudio.google.com/embed/reporting/eaa004b0-9bd1-428a-8883-e71424dd5877/page/tEnnC")}>Team Leaderboard</button>
                <button type="button" className="btn btn-primary" style={{marginLeft:"2px"}} onClick={() => setSrc("https://lookerstudio.google.com/embed/reporting/343df7f7-b249-4002-80bf-240f4f3bad99/page/tEnnC")}>User Leaderboard</button>
            </div>
            <br></br>
            <iframe
                title='Leaderboard'
                width="100%"
                height="500"
                src={src}
                style={{border:0}}
                allowFullScreen     
            ></iframe>
            </div>
        </div>
      );
}
export default Leaderboard;