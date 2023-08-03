import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Displaygames.css'


const StatusUsers = () => {
const [userStatRecords, setUserStatRecords] = useState([]);
const [totalScore, settotalScore] = useState("");
const [winCount, setwinCount] = useState("");
const [lossCount, setlossCount] = useState("");


    useEffect(()=>{
      getUserStat();
    },[])


  useEffect(() => {
    settotalScore(userStatRecords.reduce((total, record) => total + parseInt(record.score, 10), 0));
    setwinCount(userStatRecords.filter((record) => record.win === 'true').length);
    setlossCount(userStatRecords.filter((record) => record.win === 'false').length);
  }, [userStatRecords]);

    const getUserStat = async () => {
    try {
      const response = await axios.post('https://mimooazyk3.execute-api.us-east-1.amazonaws.com/first/getuserprofile', {
        "team_id":["1","2"]
      });
      setUserStatRecords(response.data);
    } catch (error) {
      console.error(error);
    }
    }

  return (
    <div style={{marginTop:'15%'}}>
        <h style={{ fontWeight: '1800', fontSize: '48px', marginLeft: '40%'}}>User Statistics</h>
        <table style={{ borderCollapse: 'collapse', width: '85%',marginLeft:'10%', marginTop:'2%' }}>
        <tbody>
          <tr>
            <th style={{ border: '1px solid black', padding: '8px' }}>Trivia Name</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Team Name</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Win</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Loss</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Score</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Game Played ON</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Trivia Category</th>
          </tr>
          {userStatRecords.map((data) => (
            <tr key={data.match_instance_id}>
              <td style={{ border: '1px solid black', padding: '8px', width:'10%' }}>{data.match_config.trivia_name}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{data.team_name}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}> {data.win === 'true' ? 'Yes' : data.win === 'false' ? 'No' : 'N/A'}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}> {data.win === 'false' ? 'Yes' : data.win === 'true' ? 'No' : 'N/A'}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{data.score}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{data.timestamp_created}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{data.match_config.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ border: '1px solid black', padding: '8px',marginLeft:'10%',marginTop:'5%', width:'10%' }}>
        <h style={{ fontWeight: 'bold' }}>Overall Status</h>
        <p>Total Score: {totalScore}</p>
        <p>Number of Wins: {winCount}</p>
        <p>Number of Loss: {lossCount}</p>
      </div>
    </div>
  )
}

export default StatusUsers