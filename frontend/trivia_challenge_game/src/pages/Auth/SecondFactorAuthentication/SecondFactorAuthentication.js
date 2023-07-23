import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { axiosJSON } from "../../../lib/axios";
import { AuthContext } from '../../../contexts/AuthContext/authcontext';

const REACT_APP_USER_AUTH_REG_CLOUD_FUNCTION_URL = process.env.REACT_APP_USER_AUTH_REG_CLOUD_FUNCTION_URL;

const SecondFactorAuthentication = () => {
  const { authContext, setAuthContext } = React.useContext(AuthContext);
  const location = useLocation();
  const { username, email, access_token, id_token } = location.state;
  const [MfaExists, setMFAExists] = useState(false);
  const [questions, setQuestions] = useState(null);
  const [questionId, setQuestionId] = useState(null);
  const [answer, setAnswer] = useState(null);

  const navigate = useNavigate();

  async function checkIf2ndFactorAuthenticationExists() {
    // Get questions as it is needed to display the questions when 2fa exists or not
    const getQuestions = await axiosJSON.get(REACT_APP_USER_AUTH_REG_CLOUD_FUNCTION_URL + '/setup2ndFactorAuthentication');
    const getQuestionsResponse = await getQuestions.data;
    try{
      const MfaExistsResponse = await axiosJSON.post(REACT_APP_USER_AUTH_REG_CLOUD_FUNCTION_URL + '/checkIf2ndFactorAuthenticationExists', JSON.stringify({ username }));
      const MfaExistsData = await MfaExistsResponse.data;
      setQuestions(getQuestionsResponse);
      if (MfaExistsData.status === 200) {
        // perform additional actions here if needed when 2FA exists
        setMFAExists(true);
      } else {
        // perform additional actions here if needed when 2FA does not exist
        setMFAExists(false);
      }
    }
    catch (error) {
      alert(error)
      navigate('/unauth/login')
    }
  }

  useEffect(() => {
    try{
      checkIf2ndFactorAuthenticationExists();
    }
    catch (error) {
      alert(error)
      navigate('/unauth/login')
    }
  }, []);

  const handleValidate2FAInputChange = (event) => {
    const { name, value } = event.target
    // if (name === 'questionId') setQuestionId(randomquestionId)
    if (name === 'answer') setAnswer(value)
  }

  async function validate2Fa(event) {
    event.preventDefault()
    try {
      const response = await axiosJSON.post(REACT_APP_USER_AUTH_REG_CLOUD_FUNCTION_URL + '/validate2ndFactorAuthentication', JSON.stringify({ username, questionId, answer }));
      const data = await response.data;
      if (data.status === 200) {
        alert(data.message)
        console.log(username, email, access_token, id_token)
        setAuthContext({username, email, access_token, id_token})
        
        await Promise.resolve(navigate('/home'))
      }
      else{
        alert(data.message)
        navigate('/unauth/login')
      }
    }
    catch (error) {
      alert(error)
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

  if (MfaExists) {
    const randomQuestionText = questions[questionId];
    return (
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
    );
  }

  return (
    <form>
      <h3>Setup 2FA Authentication</h3>
      {questions && (
        <div>
          {Object.entries(questions).reverse().map(([questionId, questionText]) => (
            <div key={questionId}>
              <label>{`${questionId}: ${questionText}`}</label>
              <input type="text" className='form-control' placeholder='your answer' name={questionId} />
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
  );
};

export default SecondFactorAuthentication;
