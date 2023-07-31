import React from 'react';
import axios from "axios";
import { Button } from '@mui/material';

const MembersTable = ({ members, teamName}) => {

  const handleEntailmentRequest = (email) => {
    try {
      console.log("in handleEntailmentRequest")
      console.log(email)
      console.log(teamName)
      axios({
        // Endpoint to send files
        url: `${process.env.REACT_APP_APIGATEWAY_URL_ARPIT}/delete_member`,
        method: "POST",
        data: {
          email: email,
          team_name: teamName
        },
      })
        // Handle the response from backend here
        .then((res) => {
          console.log("res: ", res['data']);

          if (res['data'] == "already updated") {
            alert("Already Deleted");
          }
          if (res['data'] == true) {
            console.log("successfully updated")
            alert(`${email} removed from the team ${teamName}`)
            // event.preventDefault();
            window.location.reload(false);
          }
        });
      
    } catch (error) {
      console.error('Error removing member:', error);
    }
  };

  return (
    <table style={{ border: '1px solid black', margin: '10px 0' }}>
      <thead>
        <tr>
          <th style={{ border: 'solid 1px gray' , padding: '5px' }}>
            User Name
          </th>
          <th style={{ border: 'solid 1px gray' , padding: '5px' }}>
            Email
          </th>
          <th style={{ border: 'solid 1px gray' , padding: '5px' }}>
            Status
          </th>
        </tr>
      </thead>
      <tbody>
        {console.log(members)}
        {members.map((member, index) => (
          <tr key={index}>
            <td style={{ padding: '5px', border: 'solid 1px gray' }}>
              {member.userName}
            </td>
            <td style={{ padding: '5px', border: 'solid 1px gray' }}>
              {member.email}
            </td>
            <td style={{ padding: '5px', border: 'solid 1px gray' }}>
              {member.status}
            </td>
            <td style={{ padding: '5px', border: 'solid 1px gray' }}>
              <Button variant="outlined" color="secondary" onClick={(e) => handleEntailmentRequest(member.email)}>
                Remove
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MembersTable;
