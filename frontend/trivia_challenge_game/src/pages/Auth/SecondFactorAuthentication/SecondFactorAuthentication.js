import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { axiosJSON } from "../../../lib/axios";
import { AuthContext } from '../../../contexts/AuthContext/authcontext';

const REACT_APP_USER_AUTH_REG_CLOUD_FUNCTION_URL_ABHINAV = process.env.REACT_APP_USER_AUTH_REG_CLOUD_FUNCTION_URL_ABHINAV;

const SecondFactorAuthentication = () => {
  const { setAuthContext } = React.useContext(AuthContext);
  const location = useLocation();
  const { username, email, access_token, id_token, role } = location.state;
  const [MfaExists, setMFAExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState(null);
  const [questionId, setQuestionId] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [answer1, setAnswer1] = useState(null);
  const [answer2, setAnswer2] = useState(null);
  const [answer3, setAnswer3] = useState(null);
  const [randomQuestionText, setRandomQuestionText] = useState(null);

  const navigate = useNavigate();

  async function checkIf2ndFactorAuthenticationExists() {
    // Get questions as it is needed to display the questions when 2fa exists or not
    try{
      const getQuestions = await axiosJSON.get(REACT_APP_USER_AUTH_REG_CLOUD_FUNCTION_URL_ABHINAV + '/setup2ndFactorAuthentication');
      const getQuestionsResponse = await getQuestions.data;
      setQuestions(getQuestionsResponse);
      // console.log(questions)
      const MfaExistsResponse = await axiosJSON.post(REACT_APP_USER_AUTH_REG_CLOUD_FUNCTION_URL_ABHINAV + '/checkIf2ndFactorAuthenticationExists', JSON.stringify({ username }));
      const MfaExistsData = await MfaExistsResponse.data;
      if (MfaExistsData.status === 200) {
        // perform additional actions here if needed when 2FA exists
        setMFAExists(true);
      } else if (MfaExistsData.status === 401){
        // perform additional actions here if needed when 2FA does not exist
        setMFAExists(false);
      }
      setLoading(false);
    }
    catch (error) {
      alert(error.response.data.message)
      setMFAExists(false);
      setLoading(false);
    }
  }
  
  useEffect(() => {
    try {
      checkIf2ndFactorAuthenticationExists();
    } catch (error) {
      alert(error.response.data.message);
      navigate('/unauth/login');
    }
  // eslint-disable-next-line
  }, []);

  const handleValidate2FAInputChange = (event) => {
    const { name, value } = event.target
    // if (name === 'questionId') setQuestionId(randomquestionId)
    if (name === 'answer') setAnswer(value)
  }

  const handleSetup2FAInputChange = (event) => {
    const { name, value } = event.target
    // if (name === 'questionId') setQuestionId(randomquestionId)
    if (name === 'Question 1') setAnswer1(value)
    if (name === 'Question 2') setAnswer2(value)
    if (name === 'Question 3') setAnswer3(value)
  }

  async function validate2Fa(event) {
    event.preventDefault()
    try {
      const response = await axiosJSON.post(REACT_APP_USER_AUTH_REG_CLOUD_FUNCTION_URL_ABHINAV + '/validate2ndFactorAuthentication', JSON.stringify({ username, questionId, answer }));
      const data = await response.data;
      if (data.status === 200) {
        alert(data.message)
        // console.log(username, email, access_token, id_token)
        
        setAuthContext({username, email, accessId: access_token, tokenId: id_token, role});
        navigate('/home')
      }
      else{
        alert(data.message)
        navigate('/unauth/login')
      }
    }
    catch (error) {
      alert(error.response.data.message)
      console.error(error)
      navigate('/unauth/login')
    }
  }

  useEffect(() => {
    if (MfaExists && questions) {
      const questionIds = Object.keys(questions);
      const randomIndex = Math.floor(Math.random() * questionIds.length);
      const randomQuestionId = questionIds[randomIndex];
      setQuestionId(randomQuestionId);
    }
  }, [MfaExists, questions]);

  // console.log(questions)

  async function setup2Fa(event) {
    event.preventDefault()
    try {
      const response = await axiosJSON.post(REACT_APP_USER_AUTH_REG_CLOUD_FUNCTION_URL_ABHINAV + '/setup2ndFactorAuthentication', JSON.stringify({ username, answer1, answer2, answer3}));
      const data = await response.data;
      if (data.status === 200) {
        alert(data.message)
        navigate('/unauth/login')
      }
      else{
        alert(data.message)
        console.error(data.message)
      }
      navigate('/unauth/login')
    }
    catch (error) {
      alert(error.response.data.message)
      console.error(error)
      navigate('/unauth/login')
    }
  }

  useEffect(() => {
    if (MfaExists) {
      setRandomQuestionText(questions[questionId]);
    }
  }, [MfaExists, questions, questionId]);


  return (
    loading ? 
      <div className="auth-inner"> 
        <h3>2FA Authentication</h3>
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    :
      MfaExists ?
        <div className="auth-inner"> 
          <form onSubmit={validate2Fa}>
            <h3>2FA Authentication</h3>
            <div>
              <label>{`${randomQuestionText}`}</label>
              <input type="text" className='form-control' placeholder='your answer' name="answer" onChange={handleValidate2FAInputChange}/>
              <br/>
              <div className="d-grid">
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      :
        <div className="auth-inner">
          <form onSubmit={setup2Fa}>
            <h3>Setup 2FA Authentication</h3>
            {questions && (
              <div>
                {Object.entries(questions).reverse().map(([questionId, questionText]) => (
                  <div key={questionId}>
                    <label>{`${questionId}: ${questionText}`}</label>
                    <input type="text" className='form-control' placeholder='your answer' name={questionId} onChange={handleSetup2FAInputChange}/>
                    <br/>          
                  </div>
                ))}
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
  );

}

export default SecondFactorAuthentication;
