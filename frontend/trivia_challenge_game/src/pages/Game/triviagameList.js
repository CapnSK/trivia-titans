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
  Box,
  Button,
  Typography,
} from '@mui/material';
import { useContext } from "react";
import { localStorageUtil } from "../../util";
import { AuthContext } from '../../contexts/AuthContext/authcontext';
import Alert from '@mui/material/Alert';

const GameTable = () => {
  const [gamesData, setGamesData] = useState([]);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const navigate = useNavigate();
//   const history = useHistory();
    const role = localStorageUtil.getItem('user')['role'];
    console.log(role);

  useEffect(() => {
    CheckUserRole();
    fetchGamesData();
  }, []);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString(); // Adjust the options as needed
  };

  const CheckUserRole = () => {
    console.log("reached check user role......")
    
    console.log(role);
    if (role == "player"){
      navigate("/home");
    }
    else if (typeof role === 'undefined') {
      navigate("/unauth/login");
    }
  }

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

  const handleDeleteClick = async (game_id) => {
    // const apiUrl = 'https://wfox550vtf.execute-api.us-east-1.amazonaws.com/game';
    // axios
    //   .delete(apiUrl, { data: { id } })
    //   .then((response) => {
    //     console.log('Game deleted successfully:', response.data);
    //     // Optionally, you can fetch the updated games data after deletion
    //     fetchGamesData();
    //   })
    //   .catch((error) => {
    //     console.error('Error deleting game:', error);
    //   });
    try {
        console.log(game_id);
        const response = await fetch(`https://wfox550vtf.execute-api.us-east-1.amazonaws.com/game`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 'id': game_id }),
      });
      navigate('/admin/triviagame/list');
      console.log(response);

      if (!response.ok) {
        throw new Error('Failed to delete Game. Please try again.');
      }
      
        
    } catch (error) {
      console.error('Failed to Delete Game:', error.message);
    }
  };

  const handleEditClick = (game) => {
    console.log(game);
    console.log(game.start_time);
    game.start_time = new Date(game.start_time).toISOString();
    console.log(game.start_time);
    navigate('/admin/triviagame', {state : game});
  };

  return (
    <Grid container spacing={2} justifyContent="center">
      <br />
      <Grid item xs={12} md={10} lg={8}>
      <Box mt={2} display="flex" justifyContent="center">
          <Button variant="contained" onClick={() => navigate('/admin/triviagame')}>
            Create New Trivia Game
          </Button>
        </Box>
        <Typography variant="h4">Trivia Games</Typography>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="games table">
            <TableHead>
              <TableRow style={{ fontWeight: 'bold' }}>
                <TableCell>Serial Number</TableCell>
                <TableCell style={{ border: '1px solid #ccc' }}>Game Name</TableCell>
                <TableCell style={{ border: '1px solid #ccc' }}>Description</TableCell>
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
                    <TableCell>{index + 1}</TableCell>
                  <TableCell style={{ border: '1px solid #ccc' }}>
                    {game.name}
                  </TableCell>
                  <TableCell style={{ border: '1px solid #ccc' }}>
                    {game.description}
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

