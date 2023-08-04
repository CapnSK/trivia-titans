import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Displaygames.css'

const CompareUsers = () => {

    const [loggedInUserDetails, setLoggedInUserDetails] = useState([])
    const [selectedUserDetails, setSelectedUserDetails] = useState([])
    const [userDetails, setUserDetails] = useState([""])
    const [loggedIntotalScore, loggedInsettotalScore] = useState("");
    const [loggedInwinCount, loggedInsetwinCount] = useState("");
    const [loggedInlossCount, loggedInsetlossCount] = useState("");
    const [loggedInloggedInUserMatchPlayed, setloggedInUserMatchPlayed] = useState("");
    const [totalScore, settotalScore] = useState("");
    const [winCount, setwinCount] = useState("");
    const [lossCount, setlossCount] = useState("");
    const [UserMatchPlayed, setUserMatchPlayed] = useState("");
    const [selectedUsername, setSelectedUsername] = useState(null);


    useEffect(() => {
        loggedInsettotalScore(loggedInUserDetails.reduce((total, record) => total + parseInt(record.score, 10), 0));
        setloggedInUserMatchPlayed(loggedInUserDetails.length)
        loggedInsetwinCount(loggedInUserDetails.filter((record) => record.win === 'true').length);
        loggedInsetlossCount(loggedInUserDetails.filter((record) => record.win === 'false').length);
    }, [loggedInUserDetails]);    

    useEffect(() => {
        settotalScore(selectedUserDetails.reduce((total, record) => total + parseInt(record.score, 10), 0));
        setUserMatchPlayed(selectedUserDetails.length)
        setwinCount(selectedUserDetails.filter((record) => record.win === 'true').length);
        setlossCount(selectedUserDetails.filter((record) => record.win === 'false').length);
    }, [selectedUserDetails]); 

    useEffect(()=>{
      getGameDetails();
      getLoginUserDetails();
    },[])

    useEffect(() => {
    if (selectedUsername) {
      fetchUserDetails();
    }
    },
    // eslint-disable-next-line 
    [selectedUsername]);

    const fetchUserDetails = async () => {
    const user = userDetails.find((user) => user.username === selectedUsername);
    try {
      const response = await axios.post('https://mimooazyk3.execute-api.us-east-1.amazonaws.com/first/getuserprofile', {
        "team_id":user.team_id
      });
      setSelectedUserDetails(response.data);
    } catch (error) {
      console.error(error);
    }
    }

    const getGameDetails = async () => {
    try {
      const response = await axios.get('https://mimooazyk3.execute-api.us-east-1.amazonaws.com/first/getusers', {
      });
      setUserDetails(response.data)
    } catch (error) {
      console.error(error);
    }
    }

    const getLoginUserDetails = async () => {
    try {
      const response = await axios.post('https://mimooazyk3.execute-api.us-east-1.amazonaws.com/first/getuserprofile', {
        "team_id":["1","2"]
      });
      setLoggedInUserDetails(response.data);
    } catch (error) {
      console.error(error);
    }
    }

  return (
    <div>
      <div style={{ marginTop: '5%' }}>
        <h style={{ fontWeight: '1800', fontSize: '48px', marginLeft: '35%'}}>Compare Achievements</h>
        <div style={{marginLeft:'4%'}}>
        <label htmlFor="userDropdown">Select a username:</label>
        <select
          id="userDropdown"
          onChange={(e) => setSelectedUsername(e.target.value)}
          style={{
            fontSize: '16px',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            marginRight: '10px',
          }}
        >
          <option value="">Select an option</option>
          {userDetails.map((data) => (
            <option key={data.username} value={data.username}>
              {data.username}
            </option>
          ))}
        </select>
        </div>
        <div style={{ display: 'flex', marginTop:'2%',marginLeft:'20%'}}>
        <div
          style={{
            border: '1px solid black',
            padding: '8px',
            width: '35%',
          }}
        >
          <h style={{ fontWeight: 'bold', marginLeft: '40%' }}>
            Your Overall Status
          </h>
          <p>Total Number Of Match Played: {loggedInloggedInUserMatchPlayed}</p>
          <p>Total Score: {loggedIntotalScore}</p>
          <p>Number of Wins: {loggedInwinCount}</p>
          <p>Number of Loss: {loggedInlossCount}</p>
        </div>
        {selectedUsername && (
          <>
                    <div
          style={{
            border: '1px solid black',
            padding: '8px',
            marginLeft: '2%',
            width: '35%',
          }}
        >
          <h style={{ fontWeight: 'bold', marginLeft: '40%' }}>
            {selectedUsername} Overall Status
          </h>
          <p>Total Number Of Match Player: {UserMatchPlayed}</p>
          <p>Total Score: {totalScore}</p>
          <p>Number of Wins: {winCount}</p>
          <p>Number of Loss: {lossCount}</p>
        </div>
          </>
          
        )}
      </div>
      </div>
    </div>
  );
};


export default CompareUsers