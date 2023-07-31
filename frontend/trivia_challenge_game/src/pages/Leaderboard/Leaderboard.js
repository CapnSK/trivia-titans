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
                <button type="button" class="btn btn-primary" style={{marginRight:"2px"}} onClick={() => setSrc("https://lookerstudio.google.com/embed/reporting/663c2523-2c99-41a2-993d-6967bc4e8ae1/page/tEnnC")}>Team Leaderboard</button>
                <button type="button" class="btn btn-primary" style={{marginLeft:"2px"}} onClick={() => setSrc("https://lookerstudio.google.com/embed/reporting/26c830b2-ec59-43a0-b6c1-9d19fa037b19/page/xtRYD")}>User Leaderboard</button>
            </div>
            <br></br>
            <span style={{textAlign:"center"}}>See how you stack up against other teams and users!</span>
            <br></br>
            <span style={{}}>** Leaderboards update every 24 hours **</span>
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