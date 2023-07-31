import React,{useState,useEffect} from 'react'
import axios from 'axios';
import Button from '@mui/material/Button';
import { useNavigate  } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import './Displaygames.css';

const Displaygames = () => {
    const Navigate  = useNavigate ();
    
    const [gameDetails, setGameDetails] = useState([])
    const [constgameDetails, constsetGameDetails] = useState([""])
    useEffect(()=>{
      getGameDetails();
    },[])

    const getGameDetails = async () => {
    try {
      const response = await axios.post('https://yk2nxplq22.execute-api.us-east-1.amazonaws.com/deployed/gamedetails', {
      });
      constsetGameDetails(response.data)
      setGameDetails(response.data)
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
    const uuid = uuidv4();
    try {
      const response = await axios.post('https://yk2nxplq22.execute-api.us-east-1.amazonaws.com/deployed/creatematchinstance', {
        match_instance_id: uuid,
        timestamp_created: new Date(),
        match_status: "IN_LOBBY", 
        team_id: "2", 
        team_name:"team 1",
        score: "20", 
        win: "default",
        match_config: {
            trivia_id: data.id,
            trivia_name:data.name,
            category:data.tags.category
        }
      }
      );
      alert(response.data)
    }
    catch (error) {
      console.error(error);
    }
    }


  return (
        <div style={{marginTop:'8%'}}>
          <div style={{marginLeft:'20%',marginBottom:'2%', border: '1px solid black', padding: '8px', width:'60%'}}>
            <input type='text' placeholder='Filter Category' style={{marginLeft: '11%',padding: '8px',borderRadius: '4px',border: '1px solid #ccc',outline: 'none',}}
            onChange={(e)=> filterBasedOnCategory(e.target.value)}
            />
            <input type='text' placeholder='Filter Difficulty' style={{marginLeft: '11%',padding: '8px',borderRadius: '4px',border: '1px solid #ccc',outline: 'none',}}
            onChange={(e)=> filterBasedOnDiff(e.target.value)}
            />
            <input type='text' placeholder='Time limit' style={{marginLeft: '11%',padding: '8px',borderRadius: '4px',border: '1px solid #ccc',outline: 'none',}}
            onChange={(e)=> filterBasedOnTimeLimit(e.target.value)}
            />
          </div>
            <table style={{ borderCollapse: 'collapse', width: '85%',marginLeft:'10%' }}>
        <tbody>
          <tr>
            <th style={{ border: '1px solid black', padding: '8px' }}>Game Name</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Category</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Difficulty</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Time Limit</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Game Description</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Join The Game</th>
          </tr>
          {gameDetails.map((data) => (
            <tr key={data.id}>
              <td style={{ border: '1px solid black', padding: '8px', width:'10%' }}>{data.name}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{data.tags.category}</td>
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
 