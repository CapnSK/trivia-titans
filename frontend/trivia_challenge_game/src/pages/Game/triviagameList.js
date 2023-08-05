import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import { useHistory } from 'react-router-dom';
import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

const GameTable = () => {
  const [gamesData, setGamesData] = useState([]);
  const navigate = useNavigate();
//   const history = useHistory();

  useEffect(() => {
    fetchGamesData();
  }, []);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString(); // Adjust the options as needed
  };


  const fetchGamesData = () => {
    const apiUrl = 'https://wfox550vtf.execute-api.us-east-1.amazonaws.com/game';
    axios
      .get(apiUrl)
      .then((response) => {
        setGamesData(response.data.data);
        console.log(response.data.data);
      })
      .catch((error) => {
        console.error('Error fetching games data:', error);
      });
  };

  const handleDeleteClick = (id) => {
    const apiUrl = 'https://wfox550vtf.execute-api.us-east-1.amazonaws.com/game';
    axios
      .delete(apiUrl, { data: { id } })
      .then((response) => {
        console.log('Game deleted successfully:', response.data);
        // Optionally, you can fetch the updated games data after deletion
        fetchGamesData();
      })
      .catch((error) => {
        console.error('Error deleting game:', error);
      });
  };

  const handleEditClick = (game) => {
    console.log(game);
    console.log(game.start_time);
    game.start_time = new Date(game.start_time).toISOString();
    console.log(game.start_time);
    navigate('/unauth/triviagame', {state : game});
  };

  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={12} md={10} lg={8}>
        <Typography variant="h4">Trivia Games</Typography>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="games table">
            <TableHead>
              <TableRow style={{ fontWeight: 'bold' }}>
                <TableCell>Serial Number</TableCell>
                <TableCell style={{ border: '1px solid #ccc' }}>Game Name</TableCell>
                <TableCell align="center" style={{ border: '1px solid #ccc' }}>Category</TableCell>
                <TableCell align="center" style={{ border: '1px solid #ccc' }}>Difficulty</TableCell>
                <TableCell align="center" style={{ border: '1px solid #ccc' }}>Time Limit (seconds)</TableCell>
                <TableCell align="center" style={{ border: '1px solid #ccc' }}>Start Time</TableCell>
                <TableCell align="center" style={{ border: '1px solid #ccc' }}>Max Points</TableCell>
                <TableCell align="center" style={{ border: '1px solid #ccc' }}>Leaderboard</TableCell>
                <TableCell align="center" style={{ border: '1px solid #ccc' }}>Action</TableCell>
                <TableCell align="center" style={{ border: '1px solid #ccc' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {gamesData.map((game, index) => (
                <TableRow key={game.id} style={{ border: '1px solid #ccc' }}>
                    <TableCell>{index + 1}</TableCell>``
                  <TableCell style={{ border: '1px solid #ccc' }}>
                    {game.name}
                  </TableCell>
                  <TableCell align="center" style={{ border: '1px solid #ccc' }}>{game.tags.category}</TableCell>
                  <TableCell align="center" style={{ border: '1px solid #ccc' }}>{game.tags.difficulty}</TableCell>
                  <TableCell align="center" style={{ border: '1px solid #ccc' }}>{game.time_limit}</TableCell>
                  <TableCell align="center" style={{ border: '1px solid #ccc' }}>{formatTimestamp(game.start_time)}</TableCell>
                  <TableCell align="center" style={{ border: '1px solid #ccc' }}>{game.maxPoints}</TableCell>
                  <TableCell align="center" style={{ border: '1px solid #ccc' }}>
                    {game.leaderboard.map((entry, index) => (
                      <div key={index}>{entry}</div>
                    ))}
                  </TableCell>
                  <TableCell align="center" style={{ border: '1px solid #ccc' }}>
                    <span style={{ cursor: 'pointer', color: 'blue' }} onClick={() => handleEditClick(game)}>
                      Edit
                    </span>
                  </TableCell>
                  <TableCell align="center" style={{ border: '1px solid #ccc' }}>
                    <span style={{ cursor: 'pointer', color: 'red' }} onClick={() => handleDeleteClick(game.id)}>
                      Delete
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default GameTable;

