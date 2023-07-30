import React from 'react';
import axios from "axios";
import { Button } from '@mui/material';

const MembersTable = ({ members, teamName, teamId}) => {

  const handleEntailmentRequest = (email) => {
    try {

      axios({
        // Endpoint to send files
        url: `${process.env.REACT_APP_APIGATEWAY_URL}/delete_member`,
        method: "POST",
        data: {
          id: teamId,
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
          <th style={{ borderBottom: 'solid 3px red', padding: '5px' }}>
            User Name
          </th>
          <th style={{ borderBottom: 'solid 3px red', padding: '5px' }}>
            Email
          </th>
          <th style={{ borderBottom: 'solid 3px red', padding: '5px' }}>
            Status
          </th>
        </tr>
      </thead>
      <tbody>
        {members.map((member, index) => (
          <tr key={index}>
            <td style={{ padding: '5px', border: 'solid 1px gray' }}>
              {member.M.userName.S}
            </td>
            <td style={{ padding: '5px', border: 'solid 1px gray' }}>
              {member.M.email.S}
            </td>
            <td style={{ padding: '5px', border: 'solid 1px gray' }}>
              {member.M.status.S}
            </td>
            <td style={{ padding: '5px', border: 'solid 1px gray' }}>
              <Button variant="outlined" color="secondary" onClick={(e) => handleEntailmentRequest(member.M.email.S)}>
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
