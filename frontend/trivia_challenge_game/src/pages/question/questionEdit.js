import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Grid, Paper, Typography, TextField, Button, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Chip from '@mui/material/Chip';


const EditQuestion = () => {
  const { id } = useParams();
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [question, setQuestion] = useState(null);
  const [formData, setFormData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategoriesByCategory, setSubcategoriesByCategory] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    fetchQuestion();
    fetchCategories();
  }, []);

  const handleQuestionLabelChange = (event) => {
    const { value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      label: value,
    }));
  };

  const fetchCategories = () => {
    const apiUrl = 'https://afr8i80cnj.execute-api.us-east-1.amazonaws.com/questions/category';
    axios.get(apiUrl)
      .then(response => {
        setCategories(response.data);
        console.log(categories)
        const subcategoriesData = {};
        response.data.forEach(category => {
          subcategoriesData[category.name] = category.subcategory;
        });
        setSubcategoriesByCategory(subcategoriesData);
        console.log(subcategoriesByCategory)
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });
  };

    const fetchQuestion = () => {
        const apiUrl = `https://f1gzy2sau1.execute-api.us-east-1.amazonaws.com/question/${id}`;
        axios.get(apiUrl)
        .then(response => {
            setQuestion(response.data.data);
            setFormData(response.data.data);

            const category = response.data.data?.tags?.category || '';
            setSelectedCategory(category);
            const subcategoriesForCategory = subcategoriesByCategory[category];
            if (subcategoriesForCategory) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                tags: {
                ...prevFormData.tags,
                subcategory: response.data.data?.tags?.subcategory || subcategoriesForCategory[0],
                },
            }));
            }
            console.log(formData);
        })
        .catch(error => {
            console.error('Error fetching question:', error);
        });
    };

const handleInputChange = (event, optionIndex) => {
    console.log(event);
    console.log(optionIndex);
    const { name, value } = event.target;
    setFormData((prevFormData) => {
      const updatedOptions = prevFormData.options.map((option, index) =>
        index === optionIndex ? { ...option, label: value } : option
      );
      return {
        ...prevFormData,
        options: updatedOptions,
      };
    });
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


  const handleCategoryChange = (event) => {
    const selectedCategory = event.target.value;
    setSelectedCategory(selectedCategory);

    const subcategoriesForCategory = subcategoriesByCategory[selectedCategory];
    const newSubcategory = subcategoriesForCategory ? subcategoriesForCategory[0] : '';

    setFormData((prevFormData) => ({
        ...prevFormData,
        tags: {
          ...prevFormData.tags,
          category: selectedCategory,
          subcategory: newSubcategory,
        },
      }));
  };

  const handleAnswersChange = (event) => {
    const selectedAnswers = event.target.value;
    console.log(selectedAnswers);
    setFormData((prevFormData) => ({
      ...prevFormData,
      answers: selectedAnswers,
    }));
    console.log(formData);
  };

  const handleDifficultyChange = (event) => {
    const selectedDifficulty = event.target.value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      tags: {
        ...prevFormData.tags,
        difficulty: selectedDifficulty,
      },
    }));
  };

  const handleAddAnswer = () => {
    console.log(formData);
  };

  const handleRemoveAnswer = (index) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      answers: prevFormData.answers.filter((_, i) => i !== index),
    }));
  };

  const handlePointsChange = (event) => {
    const { value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      points: value,
    }));
  };

  const handleTimeLimitChange = (event) => {
    const { value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      time_limit: value,
    }));
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
  };


  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData);
    const apiUrl = 'https://kb3tz7tz83.execute-api.us-east-1.amazonaws.com/dev/question';
    axios.put(apiUrl, formData)
      .then(response => {
        setSubmissionStatus('success');
      })
      .catch(error => {
        setSubmissionStatus('error');
      });
  };

  if (!question || categories.length === 0) {
    return (
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} md={10} lg={8}>
          <Typography variant="h4">Loading...</Typography>
        </Grid>
      </Grid>
    );
  }

  return (
    <Box p={4}> 
        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
        <br /><br /><br /><br /><br />

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

      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} md={12} lg={10}>
          <Typography variant="h4">Edit Question</Typography>
          <br />
          <form onSubmit={handleSubmit}>
          <TextField
              label="Question Label"
              variant="outlined"
              name="label"
              value={formData.label}
              onChange={handleQuestionLabelChange}
              required
            />
            <br /><br />
            
            <FormControl variant="outlined" required>
              <InputLabel>Category</InputLabel>
              <Select
                label="Category"
                value={formData.tags?.category || ''}
                onChange={handleCategoryChange}
              >
                {categories.map(category => (
                  <MenuItem key={category.id} value={category.name}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <br /><br />
            
            <FormControl variant="outlined" required>
              <InputLabel>Subcategory</InputLabel>
              <Select
                label="Subcategory"
                value={formData.tags?.subcategory || ''}
                onChange={handleSubcategoryChange}
              >
                {subcategoriesByCategory[selectedCategory]?.map((subcategory, index) => (
                  <MenuItem key={index} value={subcategory}>
                    {subcategory}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <br /><br />
            <FormControl variant="outlined" required>
        <InputLabel>Difficulty</InputLabel>
        <Select
          label="Difficulty"
          value={formData.tags?.difficulty || ''}
          onChange={handleDifficultyChange}
        >
          <MenuItem value="easy">Easy</MenuItem>
          <MenuItem value="intermediate">Intermediate</MenuItem>
          <MenuItem value="hard">Hard</MenuItem>
        </Select>
      </FormControl>

            <br /><br />
            {console.log(formData.options)}
            {formData.options.map((option, index) => (
              <div key={index}>
                <TextField
                  label={`Option ${index + 1}`}
                  variant="outlined"
                  value={option.label}
                  onChange={(e) => handleInputChange(e, index)}
                  required
                />
               <br /><br />
              </div>
            ))}
            
        <FormControl variant="outlined" required>
        <InputLabel>Answers</InputLabel>
        <Select
          label="Answers"
          multiple
          value={formData.answers}
          onChange={handleAnswersChange}
          renderValue={(selected) => (
            <div>
              {selected.map((value, index) => (
                <Chip
                  key={index}
                  label={value}
                  onDelete={() => handleRemoveAnswer(index)}
                />
              ))}
            </div>
          )}
        >
          {formData.options.map((option, index) => (
            <MenuItem key={index} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* <Button variant="contained" onClick={handleAddAnswer}>
        Add Answer
      </Button> */}

      <br /><br />
           
      <TextField
              label="Points"
              variant="outlined"
              type="number"
              name="points"
              value={formData.points}
              onChange={handlePointsChange}
              required
            />

            <br /><br />
            <TextField
              label="Time Limit (in seconds)"
              variant="outlined"
              type="number"
              name="time_limit"
              value={formData.time_limit}
              onChange={handleTimeLimitChange} 
              required
            />
            <br /><br />
            <TextField
              label="Hints"
              variant="outlined"
              name="tags.hints"
              value={formData.tags.hints}
              onChange={handleHintsChange} 
            />
            <br /><br />
            <Button variant="contained" type="submit">
              Update Question
            </Button>
          </form>
        </Grid>
      </Grid>
    </Box>
    
  );
};

export default EditQuestion;
