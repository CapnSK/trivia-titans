import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Typography, Snackbar, Grid } from '@mui/material';
import { Box } from '@mui/system';
import Chip from '@mui/material/Chip';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import Alert from '@mui/material/Alert';
import { localStorageUtil } from "../../util";


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
    id: ''
  };
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [difficulty, setDifficulty] = useState([]);
  const [categoryResponse, setCategoryResponse] = useState([]);
  const [pageHeading, setPageHeading] = useState("Create a New Question...");
  const [pageButtonName, setPageButton] = useState("Create Question");
  const navigate = useNavigate();
  const location = useLocation();
  
  // const { username, email, accessId, tokenId, role } = useContext(AuthContext);
  const role = localStorageUtil.getItem('user')['role'];
  console.log(role);

  useEffect(() => {
    
    CheckUserRole();
    fetchCategories();
    console.log(categories);
    fetchDifficulty();
  
    console.log(location.state);
    console.log(categories);
    console.log(categoryResponse);

    if (location.state) {
      setPageHeading("Update the Question...");
      setPageButton("Update Question");
      setFormData((prevFormData) => ({
        ...prevFormData,
        ...location.state,
        tags: {
          ...prevFormData.tags,
          ...location.state.tags,
        },
      }));
      fetchCategories();
      console.log(categories);
      fetchDifficulty();
    }
  }, []);

  const CheckUserRole = () => {
    console.log("reached check user role......")
    setTimeout(() => {
      console.log(role);
      if (role === "player"){
        console.log(role);
        navigate("/home");
      }
      else if (typeof role === 'undefined') {
        console.log(role);
        navigate("/unauth/login");
      }
    }, 3000);
  }

  const fetchDifficulty = () => {
    setTimeout(() => {
      const response = { "difficulty": ["easy", "intermediate", "hard"] };
      setDifficulty(response.difficulty);
    }, 500);
  };

  const getSubcategoriesByCategory = (categoryName) => {
    console.log(categoryName);
    console.log(categoryResponse);
    const category = categoryResponse.find(item => item.name === categoryName);
    console.log(category);
    return category ? category.subcategory : [];
  }

  const handleCloseSnackbar = () => {
    setSubmissionStatus(null);
  };

  const handleAnswerChange = (event) => {
    const selectedAnswers = Array.from(new Set(event.target.value));
    console.log(selectedAnswers);
    setFormData({ ...formData, answers: selectedAnswers });
  };

  const handleRemoveAnswer = (answer) => {
    const filteredAnswers = formData.answers.filter((ans) => ans !== answer);
    setFormData({ ...formData, answers: filteredAnswers });
  };

  const getOptionLabel = (optionId) => {
    const option = formData.options.find((opt) => opt.id === optionId);
    return option ? option.label : '';
  };

  const fetchCategories = () => {
    const apiUrl = 'https://wfox550vtf.execute-api.us-east-1.amazonaws.com/question/category';
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    fetch(apiUrl, {
      headers: headers
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setCategories(data);
        setCategoryResponse(data);
        console.log(categoryResponse);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });
  };
  

  const fetchSubcategories = (selectedCategory) => {
    setTimeout(() => {
      console.log(selectedCategory);
      const subcategories = getSubcategoriesByCategory(selectedCategory);
      console.log(subcategories);
      setSubcategories(subcategories);
    }, 500);
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

  const handleCategoryChange = (event) => {
    console.log(event);
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

  const handleHintsChange = (event) => {
    const { value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      tags: {
        ...prevFormData.tags,
        hints: value,
      },
    }));
    fetchSubcategories(value);
  }

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
    console.log(formData);

    const url = 'https://wfox550vtf.execute-api.us-east-1.amazonaws.com/question';

    const requestBody = {
      label: formData.label,
      options: formData.options,
      answers: formData.answers,
      tags: formData.tags,
      points: formData.points,
      time_limit: formData.time_limit,
      id: formData.id
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
        setFormData(initialFormData);
        setSubmissionStatus('success');
        // navigate('/unauth/question/list');
      })
      .catch((error) => {
        console.error('API Error:', error);
        setSubmissionStatus('error');
      });
  };

return (
  <Grid container spacing={2} justifyContent="center">
  <Grid item xs={12} md={10} lg={8}>
    <Box component="div" p={2}>
    
      <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={submissionStatus === 'success'}
            autoHideDuration={3000}
            onClose={handleCloseSnackbar}
          >
            <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
              The new question was created Successfully
            </Alert>
          </Snackbar>

          {/* Snackbar for error message */}
          <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={submissionStatus === 'error'}
            autoHideDuration={3000}
            onClose={handleCloseSnackbar}
          >
            <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
              An error occurred while creating the question
            </Alert>
          </Snackbar>
      <br />
      {/* <Button variant="contained" onClick={() => navigate('/unauth/question/list')}>
            View Questions
          </Button> */}
           <br />
          <Box mt={2} display="flex" justifyContent="center">
          <Button variant="contained" onClick={() => navigate('/admin/question/list')}>
            View Questions
          </Button>
        </Box>
        <br />
      <h2>{pageHeading}</h2>
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
        multiple
        value={formData.answers}
        onChange={handleAnswerChange}
        required
        label="Correct Answer"
        renderValue={(selected) => (
          <div>
            {selected.map((value) => (
              <Chip
                key={value}
                label={getOptionLabel(value)}
                onDelete={() => handleRemoveAnswer(value)}
                deleteIcon={<DeleteIcon />}
              />
            ))}
          </div>
        )}
      >
        {formData.options.map((option) => (
          <MenuItem key={option.label} value={option.label}>
            {getOptionLabel(option.id)}
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
              <MenuItem key={category.name} value={category.name}>
                {category.name}
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
            value={formData.tags.hints}
            onChange={handleHintsChange}
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
          {pageButtonName}
        </Button>
      </form>
    </Box>
    </Grid>
    </Grid>
  );
};

export default QuestionForm;
