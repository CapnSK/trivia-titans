import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useContext } from "react";
import { localStorageUtil } from "../../util";
import { AuthContext } from '../../contexts/AuthContext/authcontext';

import { Grid, Box, Paper, Typography, SanFormControl, FormControl, FormControlLabel, FormGroup, Checkbox, TextField, Button, Select, MenuItem, InputLabel } from '@mui/material';

const TriviaGame = () => {
    const navigate = useNavigate();
    const [gameDescription, setGameDescription] = useState('');
  const [formData, setFormData] = useState({
    name: '', 
    id: '',
    description: '',
    questions: [],
    tags: {
      category: '',
      subcategory: '',
      difficulty: '',
    },
    time_limit: 0,
    leaderboard: [],
    start_time: '',
    maxPoints: 0,
  });

  const role = localStorageUtil.getItem('user')['role'];
  console.log(role);
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [pageheading, setPageHeading] = useState("Create Trivia Game");
  const [pageButton, setPageButton] = useState("Create Game");

  const location = useLocation();

  useEffect(() => {
    CheckUserRole();
    fetchCategories();
    fetchQuestions();
    console.log(location.state);
    if (location.state) {
        setPageHeading("Update the Trivia Game...");
        setPageButton("Update Game");
        setFormData((prevFormData) => ({
            ...prevFormData,
            ...location.state,
            ...prevFormData.questions,
            questions: location.state.questions || [], // Use the selected questions from location.state or an empty array
          }));
    }
    }, []);

    const handleGameDescriptionChange = (event) => {
        const { value } = event.target;
        setGameDescription(value);
        setFormData((prevFormData) => ({
          ...prevFormData,
          description: value,
        }));
      };
    

  const fetchCategories = () => {
    const apiUrl = 'https://wfox550vtf.execute-api.us-east-1.amazonaws.com/question/category';
    axios
      .get(apiUrl)
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  };

  const fetchQuestions = () => {
    const apiUrl = 'https://wfox550vtf.execute-api.us-east-1.amazonaws.com/question';
    axios
      .get(apiUrl)
      .then((response) => {
        setQuestions(response.data.data);
      })
      .catch((error) => {
        console.error('Error fetching questions:', error);
      });
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

  const handleQuestionChange = (event) => {
    const { name, checked } = event.target;
    if (checked) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        questions: [...prevFormData.questions, name],
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        questions: prevFormData.questions.filter((questionId) => questionId !== name),
      }));
    }
  };

  const handleCategoryChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      tags: {
        ...prevFormData.tags,
        [name]: value,
      },
    }));
  };

  const handleDifficultyChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      tags: {
        ...prevFormData.tags,
        [name]: value,
      },
    }));
  };

  const handleStartTimeChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

const handleFormSubmit = async (e) => {
  e.preventDefault();

  const postData = {
    id: formData.id,
    name: formData.name,
    description: gameDescription,
    questions: filteredQuestions.map((question) => ({
      label: question.label,
      options: question.options,
      answers: question.answers,
      tags: question.tags,
      points: question.points,
      time_limit: question.time_limit,
    })),
    tags: formData.tags,
    time_limit: formData.time_limit,
    leaderboard: formData.leaderboard,
    start_time: formData.start_time,
    maxPoints: formData.maxPoints,
  };

  console.log(postData);

  const apiUrl = 'https://wfox550vtf.execute-api.us-east-1.amazonaws.com/game';

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      throw new Error('Failed to create The Game. Please try again.');
    }
    const responseData = await response.json();
    console.log('API call successful:', responseData);
    navigate('/admin/triviagame/list');
  } catch (error) {
    console.error('Error making the API call:', error);
  }
};


  const filteredQuestions = questions.filter(
    (question) =>
      question.tags.category === formData.tags.category &&
      question.tags.difficulty === formData.tags.difficulty
  );

  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={12} md={8}>
      <Box mt={2} display="flex" justifyContent="center">
          <Button variant="contained" onClick={() => navigate('/admin/triviagame/list')}>
            View Trivia Games
          </Button>
        </Box>
        <br />
        <Typography variant="h4">{pageheading}</Typography>
        <Paper style={{ padding: '20px' }}>
          <form onSubmit={handleFormSubmit}>
            <FormControl fullWidth sx={{ my: 1 }}>
              <TextField
                label="Game Name"
                variant="outlined"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleStartTimeChange}
                required
              />
            </FormControl>
            <FormControl fullWidth sx={{ my: 1 }}>
              <TextField
                label="Game Description"
                variant="outlined"
                type="text"
                name="description"
                value={formData.description}
                onChange={handleGameDescriptionChange}
                required
              />
            </FormControl>
            <FormControl fullWidth sx={{ my: 1 }}>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={formData.tags.category}
                onChange={handleCategoryChange}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.name} value={category.name}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ my: 1 }}>
              <InputLabel>Difficulty</InputLabel>
              <Select
                name="difficulty"
                value={formData.tags.difficulty}
                onChange={handleDifficultyChange}
              >
                <MenuItem value="easy">Easy</MenuItem>
                <MenuItem value="intermediate">Intermediate</MenuItem>
                <MenuItem value="difficult">Difficult</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ my: 1 }}>
              <FormGroup>
                {filteredQuestions.map((question) => (
                  <FormControlLabel
                    key={question.id}
                    control={
                      <Checkbox
                        name={question.id}
                        checked={formData.questions.includes(question.id)}
                        onChange={handleQuestionChange}
                      />
                    }
                    label={question.label}
                  />
                ))}
              </FormGroup>
            </FormControl>
            <FormControl fullWidth sx={{ my: 1 }}>
              <TextField
                label="Time Limit (seconds)"
                variant="outlined"
                type="number"
                name="time_limit"
                value={formData.time_limit}
                onChange={handleStartTimeChange}
                required
              />
            </FormControl>
            <FormControl fullWidth sx={{ my: 1 }}>
              <TextField
                label="Max Points"
                variant="outlined"
                type="number"
                name="maxPoints"
                value={formData.maxPoints}
                onChange={handleStartTimeChange}
                required
              />
            </FormControl>
            <FormControl fullWidth sx={{ my: 1 }}>
              <TextField
                label="Start Time"
                variant="outlined"
                type="datetime-local"
                name="start_time"
                value={formData.start_time}
                onChange={handleStartTimeChange}
                required
              />
            </FormControl>
            <Button variant="contained" type="submit">
              {pageButton}
            </Button>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default TriviaGame;
