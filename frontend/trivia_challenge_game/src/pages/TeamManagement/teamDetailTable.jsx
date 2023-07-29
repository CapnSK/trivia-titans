import React from 'react';
import { useTable } from 'react-table';
import MembersTable from './membersTable';

const TeamDetailTable = ({ jsonData }) => {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Team Name',
        accessor: 'team_name',
      },
      {
        Header: 'Admin Email',
        accessor: 'admin.email.S',
      },
      {
        Header: 'Admin Username',
        accessor: 'admin.username.S',
      },
      ,
      {
        Header: 'Timestamp Created',
        accessor: 'timestamp_created',
      },
      {
        Header: 'Members',
        accessor: 'members',
        Cell: ({ cell }) => {
          const { value } = cell;
          console.log("value")
          console.log(value)
          return (<div>{value.length == 0 ? (<p>No members added</p>) : (<MembersTable members={value} />)}</div>);
        },
      },
    ],
    []
  );

  const data = React.useMemo(() => [jsonData], [jsonData]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  return (
    <table {...getTableProps()} style={{ border: '1px solid black' }}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th
                {...column.getHeaderProps()}
                style={{ borderBottom: 'solid 3px red' }}
              >
                {column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return (
                  <td
                    {...cell.getCellProps()}
                    style={{
                      padding: '10px',
                      border: 'solid 1px gray',
                      background: 'papayawhip',
                    }}
                  >
                    {cell.render('Cell')}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default TeamDetailTable;
