import {useNavigate} from 'react-router-dom';
import {axiosJSON} from "../../lib/axios";
import React, { useState, useEffect, useContext } from 'react';
import { localStorageUtil } from "../../util";
import {listen, getInGameData} from '../../util/InGameEventUtils'
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthContext, InGameContext  } from "../../contexts"

const lambdaApiGatewayURL = process.env.REACT_APP_USER_AUTH_REG_LAMBDA_API_GATEWAY_ABHINAV;
const cancelPrevSubscription = new Subject()
function Landing(){
    const [username, setUsername] = useState('');
    const navigate = useNavigate();
    const role = localStorageUtil.getItem('user')['role'];
    const { setInGameContext } = useContext(InGameContext);
    
    console.log(role);

    const isAdmin = role === 'admin';

    useEffect(()=>{
        listen("JOIN_GAME").pipe(takeUntil(cancelPrevSubscription)).subscribe((event)=>{
            console.log(event.data);
            const data=getInGameData(event.data);
            setInGameContext(data);
            navigate('/in-game');
        });
      return ()=>{
        cancelPrevSubscription.next();
      }
    }, [username]);

    const handleInputChange = (event) => {
        const { name, value } = event.target
        if (name === 'username') setUsername(value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            // console.log(username)
            const response = await axiosJSON.post(lambdaApiGatewayURL + '/checkIfUserExists', JSON.stringify({ "username":username }))
            const data = await response.data
            console.log(data)
            if (data.status === "true") {
                alert(data)
            }
        }
        catch(error){
            alert(error.response.data.message)
            console.error(error)
        }
        alert('submitting');

        // navigate('/hostGame');
    }
    return (
        <div>
            <div className="auth-inner" >
                <div>
                    <button onClick={() => {navigate("/manageTeam")}}>
                        Manage your Teams!
                    </button>
                </div>
            </div>
            <div className="auth-inner" >
                <div>
                    <button onClick={() => {navigate("/leaderboard")}}>
                        View Leaderboards!
                    </button>
                </div>
            </div>
            <div className="auth-inner" >
                <div>
                    <button onClick={() => {navigate("/userProfile")}}>
                        User Profile Management
                    </button>
                </div>
            </div>
            <div className="auth-inner" >
                <div>
                    <button onClick={() => {navigate("/joinGame")}}>
                       Join Game
                    </button>
                </div>
            </div>
            {isAdmin && (
        <>
          <div className="auth-inner">
            <div>
              <button onClick={() => navigate("/admin/triviagame/list")}>
                Admin Games
              </button>
            </div>
          </div>
          <div className="auth-inner">
            <div>
              <button onClick={() => navigate("/admin/question/list")}>
                Admin Questions
              </button>
            </div>
          </div>
        </>
      )}
            <div className="auth-inner" >
                <div>
                    <form onSubmit={handleSubmit}> 
                        <h3>Host Game</h3>
                        <label> Username</label>
                        <input type="text" name='username' placeholder="Enter Username"  onChange={handleInputChange} />
                        <button type='submit'>
                            submit
                        </button>
                    </form>
                </div>    
            </div>
        </div>
        
    );
}

export default Landing;