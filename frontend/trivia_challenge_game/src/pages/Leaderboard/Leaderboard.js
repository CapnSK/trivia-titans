import {React, useState} from 'react';

function Leaderboard(){

    const [src, setSrc] = useState();


    return (
        <div className="auth-inner-leaderboard"> 
            <div width= "100%">
            <h1 style={{textAlign:"center"}}>Leaderboard</h1>
            <br></br>
            {/* Two buttons: one for team leaderboards, and one for user leaderboards */}
            <div style={{textAlign:"right"}}>
                <button type="button" class="btn btn-primary" style={{marginRight:"2px"}} onClick={() => setSrc("https://lookerstudio.google.com/embed/reporting/eaa004b0-9bd1-428a-8883-e71424dd5877/page/tEnnC")}>Team Leaderboard</button>
                <button type="button" class="btn btn-primary" style={{marginLeft:"2px"}} onClick={() => setSrc("https://lookerstudio.google.com/embed/reporting/343df7f7-b249-4002-80bf-240f4f3bad99/page/tEnnC")}>User Leaderboard</button>
            </div>
            <br></br>
            <span style={{textAlign:"center"}}>See how you stack up against other teams and users!</span>
            <br></br>
            <iframe
                title='Leaderboard'
                width="100%"
                height="500"
                src={src}
                frameborder="0"
                style={{border:0}}
                allowfullscreen
            ></iframe>
            </div>
        </div>
      );
}
export default Leaderboard;