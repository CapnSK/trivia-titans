import React from 'react';

const MembersTable = ({ members }) => {
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
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MembersTable;
