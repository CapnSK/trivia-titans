import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useContext } from "react";
import { AuthContext } from '../../contexts/AuthContext/authcontext';
import { localStorageUtil } from "../../util";
import { Grid, Button, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

const QuestionList = () => {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();
  const role = localStorageUtil.getItem('user')['role'];
  console.log(role);

  useEffect(() => {
    CheckUserRole();
    fetchQuestions();
  }, []);

  const handleEdit = async (question) =>    {
    console.log(question);
    navigate('/admin/question', {state : question});
  }

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

  const handleDelete = async (question_id) => {
    try {
        console.log(question_id);
        const response = await fetch(`https://wfox550vtf.execute-api.us-east-1.amazonaws.com/question`, {
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
    navigate('/admin/question/list');
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
          console.log(response.data)
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
        <br /><br /><br /><br /><br /><br /><br /><br />
        <Box mt={2} display="flex" justifyContent="center">
          <Button variant="contained" onClick={() => navigate('/admin/question')}>
            Create New Question
          </Button>
        </Box>
        <br />
          <Table>
            <TableHead>
              <TableRow>
              <TableCell sx={{ border: '1px solid #ccc' }}>Serial Number</TableCell>
                <TableCell sx={{ border: '1px solid #ccc' }}>Question Label</TableCell>
                <TableCell sx={{ border: '1px solid #ccc' }}>Category</TableCell>
                <TableCell sx={{ border: '1px solid #ccc' }}>Subcategory</TableCell>
                <TableCell sx={{ border: '1px solid #ccc' }}>Difficulty</TableCell>
                <TableCell sx={{ border: '1px solid #ccc' }}>Options</TableCell>
                <TableCell sx={{ border: '1px solid #ccc' }}>Answers</TableCell>
                <TableCell sx={{ border: '1px solid #ccc' }}>Points</TableCell>
                <TableCell sx={{ border: '1px solid #ccc' }}>Time Limit (seconds)</TableCell>
                <TableCell sx={{ border: '1px solid #ccc' }}>Hints</TableCell>
                <TableCell sx={{ border: '1px solid #ccc' }}>Tags</TableCell> {/* New field "Extra" */}
                <TableCell align="center" sx={{ border: '1px solid #ccc' }}>Action</TableCell>
                <TableCell align="center" sx={{ border: '1px solid #ccc' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {questions.map((question, index) => (
                <TableRow key={question.id}> 
                  <TableCell sx={{ border: '1px solid #ccc' }}>{index + 1}</TableCell>
                  <TableCell sx={{ border: '1px solid #ccc' }}>{question.label}</TableCell>
                  <TableCell sx={{ border: '1px solid #ccc' }}>{question.tags.category}</TableCell>
                  <TableCell sx={{ border: '1px solid #ccc' }}>{question.tags.subcategory}</TableCell>
                  <TableCell sx={{ border: '1px solid #ccc' }}>{question.tags.difficulty}</TableCell>
                  <TableCell sx={{ border: '1px solid #ccc' }}>
                    {question.options.map((option) => (
                      <span key={option.id}>{option.label}, </span>
                    ))}
                  </TableCell>
                  <TableCell sx={{ border: '1px solid #ccc' }}>
                    {question.answers.map((answer, index) => (
                      <span key={answer}>
                        {answer}
                        {index !== question.answers.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </TableCell>
                  <TableCell sx={{ border: '1px solid #ccc' }}>{question.points}</TableCell>
                  <TableCell sx={{ border: '1px solid #ccc' }}>{question.time_limit}</TableCell>
                  <TableCell sx={{ border: '1px solid #ccc' }}>{question.tags.hints}</TableCell>
                  <TableCell sx={{ border: '1px solid #ccc' }}>
                    {/* New field "Extra" */}
                    {question.tags.extra.map((extraItem, index) => (
                      <span key={index}>
                        {extraItem}
                        {index !== question.tags.extra.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </TableCell>
                  <TableCell align="center" sx={{ border: '1px solid #ccc' }}>
                  <a
                    href="#"
                    onClick={() => handleEdit(question)}
                    style={{
                      fontSize: '1.0rem',
                      padding: '2px 2px',
                      marginRight: '15px',
                      backgroundColor: 'transparent',
                      color: 'blue',
                      textDecoration: 'underline',
                      cursor: 'pointer',
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
                      backgroundColor: 'transparent',
                      color: 'red',
                      textDecoration: 'underline',
                      cursor: 'pointer',
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
