import React,{useState,useEffect} from 'react'
import axios from 'axios';
import Button from '@mui/material/Button';
import { useContext } from "react";
import { useNavigate  } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import './Displaygames.css';
import {listen} from '../../util/InGameEventUtils'
import {join_game, introduce} from '../../util/InGameEventUtils'
import { take } from 'rxjs/operators';
import { AuthContext  } from "../../contexts"


const Displaygames = () => {
    const [gameDetails, setGameDetails] = useState([])
    const [teamID, setTeamID] = useState("")
    const [teamName, setTeamName] = useState("")
    const [constgameDetails, constsetGameDetails] = useState([""])
    const navigate  = useNavigate ();
    const { username } = useContext(AuthContext);
    useEffect(()=>{
      getTeamID();
      getGameDetails();
      listen("JOIN_GAME").pipe(take(1)).subscribe((event)=>{
            console.log(event.data);
            navigate('/in-game',{ state: { data: event.data } });
      })  
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

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
    try {
      const response = await axios.post('https://eytk5os3vl.execute-api.us-east-1.amazonaws.com/first/team_id', {
        "username":"Abhi1331"
      });
      if(response.data==null)
      {
        alert("the user doesnot have team id");
      }
      else
      {
        setTeamID(JSON.stringify(response.data.teamID))
        setTeamName(JSON.stringify(response.data.teamName))
        alert("teamName is" + teamName + "team id id" + teamID)
      }
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
    const uuid ="t011223";
    try {
      const response = await axios.post('https://pq0aowhf98.execute-api.us-east-1.amazonaws.com/first/creatematchinstance', {
        match_instance_id: uuid,
        timestamp_created: "1689012982155",
        match_status: "IN_LOBBY", 
        team_id: teamID, 
        team_name:teamName,
        score: "20", 
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
    introduce({username:"Jamura",teamId:"triviaTitans1221"})
    setTimeout(()=>{
    join_game({username:"Jamura",matchInstanceId: "t011223", timestampCreated: "1689012982155", teamId:"triviaTitans1221"})
    }, 2000)

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
 