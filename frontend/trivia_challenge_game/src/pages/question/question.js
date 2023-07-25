import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Typography, Snackbar } from '@mui/material';
import { Box } from '@mui/system';


const QuestionForm = () => {
  const initialFormData = {
    label: '',
    options: [
      { id: 'option1', label: '' },
      { id: 'option2', label: '' },
      { id: 'option3', label: '' },
      { id: 'option4', label: '' },
    ],
    answers: [],
    tags: {
      difficulty: '',
      hints: '',
      category: '',
      subcategory: '',
    },
    points: 0,
    time_limit: 0,
  };
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [difficulty, setDifficulty] = useState([]);

  useEffect(() => {
    // Fetch categories from the API here
    fetchCategories();
    fetchDifficulty()
  }, []);

  const fetchDifficulty = () => {
    // Simulating API call with a delay
    setTimeout(() => {
      const response = { "difficulty": ["easy", "intermediate", "hard"] };
      setDifficulty(response.difficulty);
    }, 1000); // Adjust the delay as needed
  };

  const handleCloseSnackbar = () => {
    // Close the snackbar
    setSubmissionStatus(null);
  };

  const fetchCategories = () => {
    // Simulating API call with a delay
    setTimeout(() => {
      const response = { "category": ["Science", "Technology", "Fiction", "Sports", "Food"] };
      setCategories(response.category);
    }, 1000); // Adjust the delay as needed
  };

  const fetchSubcategories = (selectedCategory) => {
    // Simulating API call with a delay
    setTimeout(() => {
      // Fetch subcategories based on the selected category from the API here
      // For demonstration, let's populate subcategories randomly
      const randomSubcategories = Array.from({ length: 5 }, (_, index) => `Subcategory ${index + 1}`);
      setSubcategories(randomSubcategories);
    }, 500); // Adjust the delay as needed
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleOptionChange = (event, index) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => {
      const updatedOptions = [...prevFormData.options];
      updatedOptions[index] = {
        ...updatedOptions[index],
        [name]: value,
      };
      return {
        ...prevFormData,
        options: updatedOptions,
      };
    });
  };

  const handleAnswerChange = (event) => {
    const { value } = event.target;
    setFormData({
      ...formData,
      answers: [value],
    });
  };

  const handleCategoryChange = (event) => {
    const { value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      tags: {
        ...prevFormData.tags,
        category: value,
      },
    }));
    fetchSubcategories(value);
  };

  const handleSubcategoryChange = (event) => {
    const { value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      tags: {
        ...prevFormData.tags,
        subcategory: value,
      },
    }));
  };
  const handleDifficultyChange = (event) => {
    const { value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      tags: {
        ...prevFormData.tags,
        difficulty: value,
      },
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Do something with the formData, e.g., save it to a database
    console.log(formData);

    // Make the API request
    const url = 'https://kb3tz7tz83.execute-api.us-east-1.amazonaws.com/dev/question';
    const requestBody = {
      label: formData.label,
      options: formData.options,
      answers: formData.answers,
      tags: formData.tags,
      hints: formData.hints,
      points: formData.points,
      time_limit: formData.time_limit,
    };
    console.log(requestBody)
    const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

    axios.post(url, requestBody, config)
      .then((response) => {
        console.log('API Response:', response.data);
        // Clear the form after successful submission
        setFormData(initialFormData);
        setSubmissionStatus('success');
      })
      .catch((error) => {
        console.error('API Error:', error);
        setSubmissionStatus('error');
      });
  };

return (
    
    <Box component="div" p={2}>
        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
        <br />
      {/* Display the response message */}
      {submissionStatus === 'success' && (
        <Typography variant="h8" color="success">
            The new question was created Successfully
        </Typography>
      )}
      {submissionStatus === 'error' && (
        <Typography variant="h8" color="error">
          An error occurred while creating the question
        </Typography>
      )}
      <br />
      <h2>Create a New Question</h2>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth sx={{ my: 1 }}>
          <TextField
            label="Question Label"
            variant="outlined"
            name="label"
            value={formData.label}
            onChange={handleInputChange}
            required
          />
        </FormControl>
        <br />
        {formData.options.map((option, index) => (
          <div key={option.id}>
            <FormControl fullWidth sx={{ my: 1 }}>
              <TextField
                label={`Option ${index + 1}`}
                variant="outlined"
                name="label"
                value={option.label}
                onChange={(e) => handleOptionChange(e, index)}
                required
              />
            </FormControl>
          </div>
        ))}
        <br />
        <FormControl fullWidth sx={{ my: 1 }}>
          <InputLabel>Correct Answer</InputLabel>
          <Select
            name="answers"
            value={formData.answers[0]}
            onChange={handleAnswerChange}
            required
            label="Correct Answer"
          >
            <MenuItem value="" disabled>
              Select an option
            </MenuItem>
            {formData.options.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <br />
        <FormControl fullWidth sx={{ my: 1 }}>
          <InputLabel>Category</InputLabel>
          <Select
            name="tags.category"
            value={formData.tags.category}
            onChange={handleCategoryChange}
            required
            label="Category"
          >
            <MenuItem value="" disabled>
              Select a category
            </MenuItem>
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <br />
        <FormControl fullWidth sx={{ my: 1 }}>
          <InputLabel>Subcategory</InputLabel>
          <Select
            name="tags.subcategory"
            value={formData.tags.subcategory}
            onChange={handleSubcategoryChange}
            required
            label="Subcategory"
          >
            <MenuItem value="" disabled>
              Select a subcategory
            </MenuItem>
            {subcategories.map((subcategory) => (
              <MenuItem key={subcategory} value={subcategory}>
                {subcategory}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <br />
        <FormControl fullWidth sx={{ my: 1 }}>
          <InputLabel>Difficulty</InputLabel>
          <Select
            name="tags.difficulty"
            value={formData.tags.difficulty}
            onChange={handleDifficultyChange}
            required
            label="Difficulty"
          >
            <MenuItem value="" disabled>
              Select a difficulty
            </MenuItem>
            {difficulty.map((diff) => (
              <MenuItem key={diff} value={diff}>
                {diff}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <br />
        <FormControl fullWidth sx={{ my: 1 }}>
          <TextField
            label="Hints"
            variant="outlined"
            name="hints"
            value={formData.hints}
            onChange={handleInputChange}
          />
        </FormControl>
        <br />
        <FormControl fullWidth sx={{ my: 1 }}>
          <TextField
            label="Points"
            variant="outlined"
            type="number"
            name="points"
            value={formData.points}
            onChange={handleInputChange}
            required
          />
        </FormControl>
        <br />
        <FormControl fullWidth sx={{ my: 1 }}>
          <TextField
            label="Time Limit (in seconds)"
            variant="outlined"
            type="number"
            name="time_limit"
            value={formData.time_limit}
            onChange={handleInputChange}
            required
          />
        </FormControl>
        <br />
        <Button variant="contained" type="submit">
          Create Question
        </Button>
      </form>
      {/* Snackbar for displaying the response message
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={submissionStatus !== null}
        autoHideDuration={3000} // Adjust the duration as needed (in milliseconds)
        onClose={handleCloseSnackbar}
      >
        <Typography variant="h6" color={submissionStatus === 'success' ? 'success' : 'error'}>
          {submissionStatus === 'success'
            ? 'The new question was created Successfully'
            : 'An error occurred while creating the question'}
        </Typography>
      </Snackbar> */}
    </Box>
  );
};

export default QuestionForm;
