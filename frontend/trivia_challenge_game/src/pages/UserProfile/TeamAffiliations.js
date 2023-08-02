import React,{useState,useEffect} from 'react'
import axios from 'axios';
import Button from '@mui/material/Button';
import './Displaygames.css';


const TeamAffiliations = () => {
    const [teamDetails, setteamDetails] = useState([""])
    useEffect(()=>{
      getTeamDetails();
    },[])

    const getTeamDetails = async () => {
    try {
      const response = await axios.post('https://3te1skk580.execute-api.us-east-1.amazonaws.com/First/team_id', {
        "username":"Abhi1331",
        "status":"ACCEPTED"
      });
      if(response.data==null)
      {
        alert("the user doesnot have team id");
      }
      else
      {
        setteamDetails(response.data)
      }
    } catch (error) {
      console.error(error);
    }
    }    

    const remove = async (data) => {
    try {
      const response = await axios.post('https://5j12he8uf0.execute-api.us-east-1.amazonaws.com/first/removeuserfromteam', {
        "username":"Abhi1331",
        "team_id":data.teamID
      }
      );
      getTeamDetails();
    }
    catch (error) {
      console.error(error);
    }

    }


  return (
        <div style={{marginTop:'2%'}}>
                <h style={{ fontWeight: '1800', fontSize: '48px', marginLeft: '35%'}}>Team Affiliations</h>
            <table style={{ borderCollapse: 'collapse', width: '65%',marginLeft:'15%' }}>
        <tbody>
          <tr>
            <th style={{ border: '1px solid black', padding: '8px' }}>Team ID</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Team Name</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Remove</th>
          </tr>
          {teamDetails.map((data) => (
            <tr key={data.teamID}>
              <td style={{ border: '1px solid black', padding: '8px', width:'10%' }}>{data.teamID}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{data.teamName}</td>
              <td style={{ border: '1px solid black', padding: '8px', width:'20%' }}>
                <Button
                  onClick={() => remove(data)}
                  variant='contained'
                  color='primary'
                  style={{ width: '100%' }}
                >
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    )
}

export default TeamAffiliations
 