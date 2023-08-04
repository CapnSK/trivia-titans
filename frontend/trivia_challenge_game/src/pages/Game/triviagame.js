import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Paper, Typography, FormControl, FormControlLabel, FormGroup, Checkbox, TextField, Button, Select, MenuItem, InputLabel } from '@mui/material';

const TriviaGame = () => {
  const [formData, setFormData] = useState({
    gameName: '', 
    id: 'trivia 1',
    questions: [],
    tags: {
      category: '',
      subcategory: '',
      difficulty: 'easy',
    },
    time_limit: 30,
    leaderboard: [],
    start_time: '2023-08-04T23:00:00',
    maxPoints: 15,
  });

  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchQuestions();
  }, []);

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
    name: formData.gameName,
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
        <Typography variant="h4">Trivia Create Game</Typography>
        <Paper style={{ padding: '20px' }}>
          <form onSubmit={handleFormSubmit}>
            <FormControl fullWidth sx={{ my: 1 }}>
              <TextField
                label="Game Name"
                variant="outlined"
                type="text"
                name="gameName"
                value={formData.gameName}
                onChange={handleStartTimeChange}
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
              Submit
            </Button>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default TriviaGame;
