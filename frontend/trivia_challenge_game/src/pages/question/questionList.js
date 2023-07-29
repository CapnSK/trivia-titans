import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

const QuestionList = () => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = () => {
    const apiUrl = 'https://kb3tz7tz83.execute-api.us-east-1.amazonaws.com/dev/question';
    axios.get(apiUrl)
      .then(response => {
        if (response.data?.data?.length > 0) {
          setQuestions(response.data.data);
        }
      })
      .catch(error => {
        console.error('Error fetching questions:', error);
      });
  };

  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={12} md={10} lg={8}>
        <Typography variant="h4">List of Questions</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Question Label</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Subcategory</TableCell>
                <TableCell>Difficulty</TableCell>
                <TableCell>Options</TableCell>
                <TableCell>Answers</TableCell>
                <TableCell>Points</TableCell>
                <TableCell>Time Limit (seconds)</TableCell>
                <TableCell>Hints</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {questions.map((question) => (
                <TableRow key={question.id}>
                  <TableCell>{question.label}</TableCell>
                  <TableCell>{question.tags.category}</TableCell>
                  <TableCell>{question.tags.subcategory}</TableCell>
                  <TableCell>{question.tags.difficulty}</TableCell>
                  <TableCell>{question.options.join(', ')}</TableCell>
                  <TableCell>{question.answers.join(', ')}</TableCell>
                  <TableCell>{question.points}</TableCell>
                  <TableCell>{question.time_limit}</TableCell>
                  <TableCell>{question.tags.hints}</TableCell>
                  <TableCell align="center">
                    <Link to={`/edit/${question.id}`}>
                      Edit
                    </Link>
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

export default QuestionList;
