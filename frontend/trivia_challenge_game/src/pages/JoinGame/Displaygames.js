import React,{useState,useEffect} from 'react'
import axios from 'axios';
import Button from '@mui/material/Button';
import { useContext } from "react";
import { useNavigate  } from 'react-router-dom';
// eslint-disable-next-line
import { v4 as uuidv4 } from 'uuid';
import './Displaygames.css';
import {listen, getInGameData} from '../../util/InGameEventUtils'
import {join_game, introduce} from '../../util/InGameEventUtils'
import { take } from 'rxjs/operators';
import { AuthContext, InGameContext  } from "../../contexts"


const Displaygames = () => {
    const [gameDetails, setGameDetails] = useState([])
    const [teamID, setTeamID] = useState("")
    const [teamName, setTeamName] = useState("")
    const [constgameDetails, constsetGameDetails] = useState([""])
    const { setInGameContext } = useContext(InGameContext);
    const navigate  = useNavigate ();
    // eslint-disable-next-line
    const { username } = useContext(AuthContext);
    console.log("Displaygames :: entering :: logged in user", username);
    useEffect(()=>{
      // getTeamID();
      //dummy change
      getGameDetails();
      listen("JOIN_GAME").pipe(take(1)).subscribe((event)=>{
            console.log(event.data);
            const data=getInGameData(event.data);
            setInGameContext(data);
            navigate('/in-game');
      })  
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },[username])

    const getGameDetails = async () => {
    try {
      const response = await axios.post('https://pq0aowhf98.execute-api.us-east-1.amazonaws.com/first/gamedetails', {
      });
      constsetGameDetails(response.data)
      setGameDetails(response.data)
    } catch (error) {
      console.error(error);
    }
    }

    const getTeamID = async () => {
      if (username === undefined || username === null || username === "") {
        // alert("Please login to join the game")
        // navigate('/login');
        return;
      }
    try {
      const response = await axios.post('https://eytk5os3vl.execute-api.us-east-1.amazonaws.com/first/team_id', {
        "username": username,
        "status":"ACCEPTED"
      });
      console.log(response)
      // alert("the user doesnot have team id");
      setTeamID(response.data[0].teamID)
      setTeamName(response.data[0].teamName)
      // alert("teamName is" + teamName + "team id id" + teamID)

    } catch (error) {
      console.error(error);
    }
    }    

    const filterBasedOnDiff = (data)=>{
            console.log('inside filterBasedOnDiff')
      const filteredDiff=constgameDetails.filter((item)=> item.tags.difficulty.includes(data)) 
      setGameDetails(filteredDiff)
    }    
    const filterBasedOnCategory = (data)=>{
      console.log('inside filterBasedOnCategory')
        const filteredCatergory=constgameDetails.filter((item)=> item.tags.category.includes(data))
        setGameDetails(filteredCatergory)
    }
    const filterBasedOnTimeLimit = (data)=>{
      console.log('inside filterBasedOnTimeLimit')
        const filteredTimeLimit=constgameDetails.filter((item)=> item.time_limit.includes(data))
        setGameDetails(filteredTimeLimit)
    }
    const joinGame = async (data) => {
    const uuid =uuidv4();
    const timestamp = Date.now()+"";
    try {
      // eslint-disable-next-line
      const response = await axios.post('https://pq0aowhf98.execute-api.us-east-1.amazonaws.com/first/creatematchinstance', {
        match_instance_id: uuid,
        timestamp_created: timestamp,
        match_status: "IN_LOBBY", 
        team_id: "43e33233-5a8f-4a4d-92ab-12b83f5d13ef", 
        team_name:teamName,
        score: "0", 
        win: "default",
        match_config: {
            trivia_id: data.id,
            trivia_name:data.name,
            category:data.tags.category
        }
      }
      );
      alert("The user has joined the game")
    }
    catch (error) {
      console.error(error);
    }
    join_game({username:username,matchInstanceId: uuid, timestampCreated: timestamp, teamId:"43e33233-5a8f-4a4d-92ab-12b83f5d13ef"});
    // introduce({username:"capsk",teamId:"1"})
    // setTimeout(()=>{
    // }, 2000)

    }


  return (
        <div style={{marginTop:'3%'}}>
          <h style={{ fontWeight: '1800', fontSize: '48px', marginLeft: '35%'}}>Trivia Game Lobby</h>
          <div style={{marginLeft:'20%',marginBottom:'2%', border: '1px solid black', padding: '8px', width:'60%'}}>
            <input type='text' placeholder='Filter Category' style={{marginLeft: '5%', width:'23%', padding: '8px',borderRadius: '4px',border: '1px solid #ccc',outline: 'none',}}
            onChange={(e)=> filterBasedOnCategory(e.target.value)}
            />
            <input type='text' placeholder='Filter Difficulty' style={{marginLeft: '5%',  width:'23%', padding: '8px',borderRadius: '4px',border: '1px solid #ccc',outline: 'none',}}
            onChange={(e)=> filterBasedOnDiff(e.target.value)}
            />
            <input type='text' placeholder='Time limit' style={{marginLeft: '5%',  width:'23%', padding: '8px',borderRadius: '4px',border: '1px solid #ccc',outline: 'none',}}
            onChange={(e)=> filterBasedOnTimeLimit(e.target.value)}
            />
          </div>
            <table style={{ borderCollapse: 'collapse', width: '85%',marginLeft:'7%' }}>
        <tbody>
          <tr>
            <th style={{ border: '1px solid black', padding: '8px' }}>Game Name</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Category</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Number of Player Joined</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Difficulty</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Time Limit</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Game Description</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Join The Game</th>
          </tr>
          {gameDetails.map((data) => (
            <tr key={data.id}>
              <td style={{ border: '1px solid black', padding: '8px', width:'10%' }}>{data.name}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{data.tags.category}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>5</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{data.tags.difficulty}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{data.time_limit}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{data.description}</td>
              <td style={{ border: '1px solid black', padding: '8px', width:'20%' }}>
                <Button
                  onClick={() => joinGame(data)}
                  variant='contained'
                  color='primary'
                  style={{ width: '100%' }}
                >
                  Join Game
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    )
}

export default Displaygames
 