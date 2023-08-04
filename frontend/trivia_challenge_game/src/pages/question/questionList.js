import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

const QuestionList = () => {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleEdit = async (question) =>    {
    console.log(question);
    navigate('/unauth/question', {state : question});
  }

  const handleDelete = async (question_id) => {
    try {
        console.log(question_id);
        const response = await fetch(`https://wfox550vtf.execute-api.us-east-1.amazonaws.com/question/${question_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 'id': question_id }),
      });
      console.log(response);

      if (!response.ok) {
        throw new Error('Failed to delete Question. Please try again.');
      }
    navigate('/unauth/question/list');
    } catch (error) {
      console.error('Failed to Delete Question:', error.message);
    }
  };

  const fetchQuestions = () => {
    const apiUrl = 'https://wfox550vtf.execute-api.us-east-1.amazonaws.com/question';
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
                <TableCell sx={{ border: '1px solid #ccc' }}>Question Label</TableCell>
                <TableCell sx={{ border: '1px solid #ccc' }}>Category</TableCell>
                <TableCell sx={{ border: '1px solid #ccc' }}>Subcategory</TableCell>
                <TableCell sx={{ border: '1px solid #ccc' }}>Difficulty</TableCell>
                <TableCell sx={{ border: '1px solid #ccc' }}>Options</TableCell>
                <TableCell sx={{ border: '1px solid #ccc' }}>Answers</TableCell>
                <TableCell sx={{ border: '1px solid #ccc' }}>Points</TableCell>
                <TableCell sx={{ border: '1px solid #ccc' }}>Time Limit (seconds)</TableCell>
                <TableCell sx={{ border: '1px solid #ccc' }}>Hints</TableCell>
                <TableCell align="center" sx={{ border: '1px solid #ccc' }}>Action</TableCell>
                <TableCell align="center" sx={{ border: '1px solid #ccc' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {questions.map((question) => (
                <TableRow key={question.id}> 
                  <TableCell sx={{ border: '1px solid #ccc' }}>{question.label}</TableCell>
                  <TableCell sx={{ border: '1px solid #ccc' }}>{question.tags.category}</TableCell>
                  <TableCell sx={{ border: '1px solid #ccc' }}>{question.tags.subcategory}</TableCell>
                  <TableCell sx={{ border: '1px solid #ccc' }}>{question.tags.difficulty}</TableCell>
                  <TableCell sx={{ border: '1px solid #ccc' }}>
                    {/* Map through the options and display their labels separated by comma */}
                    {question.options.map((option) => (
                      <span key={option.id}>{option.label}, </span>
                    ))}
                  </TableCell>
                  <TableCell sx={{ border: '1px solid #ccc' }}>
                    {/* Map through the answers and display their labels separated by comma */}
                    {question.answers.map((answer, index) => (
                      <span key={answer}>
                        {answer}
                        {index !== question.answers.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </TableCell>
                  {/* <TableCell>{question.answers.join(', ')}</TableCell> */}
                  <TableCell sx={{ border: '1px solid #ccc' }}>{question.points}</TableCell>
                  <TableCell sx={{ border: '1px solid #ccc' }}>{question.time_limit}</TableCell>
                  <TableCell sx={{ border: '1px solid #ccc' }}>{question.tags.hints}</TableCell>
            
                  <TableCell align="center" sx={{ border: '1px solid #ccc' }}>
                  <a
                    href="#"
                    onClick={() => handleEdit(question)}
                    style={{
                      fontSize: '1.0rem',
                      padding: '2px 2px',
                      marginRight: '15px',
                      backgroundColor: 'transparent', // Set background to transparent
                      color: 'blue', // Change the color to blue for the "Edit" text
                      textDecoration: 'underline', // Add an underline to make it look like a link
                      cursor: 'pointer', // Show a hand cursor on hover to indicate it's clickable
                    }}
                  >
                    Edit
                  </a>
                </TableCell>
                <TableCell align="center" sx={{ border: '1px solid #ccc' }}>
                  <a
                    href="#"
                    onClick={() => handleDelete(question.id)}
                    style={{
                      fontSize: '1.0rem',
                      padding: '2px 2px',
                      marginRight: '15px',
                      backgroundColor: 'transparent', // Set background to transparent
                      color: 'red', // Change the color to red for the "Delete" text
                      textDecoration: 'underline', // Add an underline to make it look like a link
                      cursor: 'pointer', // Show a hand cursor on hover to indicate it's clickable
                    }}
                  >
                    Delete
                  </a>
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
