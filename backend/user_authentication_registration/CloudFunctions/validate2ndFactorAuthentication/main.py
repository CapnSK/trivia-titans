# There are 2 firestore documents. 
# Cognito-2nd_Factor_Authentication-Questions: has only one document which has 3 predefined questions, with field names Question 1, Question 2, and Question 3.
# Cognito-2nd_Factor_Authentication-Users: has documents named with user's username. If a document exists, it means that the user has set up 2nd factor authentication.
# This method gets all questions from the Cognito-2nd_Factor_Authentication-Questions collection, and 
# returns one question randomly to the user, if the answer provided by him matches the response stored in Cognito-2nd_Factor_Authentication-Users, then return true.
# Else, retry 2 more times, each time with another question. If all 3 attempts fail, return false. 

from http import HTTPStatus
import json
import firebase_admin
from firebase_admin import firestore
import functions_framework

# Use the application default credentials
firebase_admin.initialize_app()

# Initialize Firestore DB
db = firestore.client()

@functions_framework.http
def validate2ndFactorAuthentication(request):
    
    # Get the questions from the Cognito-2nd_Factor_Authentication-Questions document
    questions_ref = db.collection('Cognito-2nd_Factor_Authentication-Questions')
    questions = questions_ref.stream()

    if request.path == '/populate':
        return json.dumps(next(questions).to_dict())


    request_json = request.get_json()

    if not request_json or 'answer' not in request_json or 'questionId' not in request_json or 'username' not in request_json:
        return json.dumps({'status': HTTPStatus.BAD_REQUEST, 'message': 'numberOfTries, answer, and questionId are required. Invalid Arguments.'})
    
    questionId = request_json.get('questionId')
    answer = request_json.get('answer')
    username = request_json.get('username')

    if questionId == "" or answer == "" or username == "":
        return json.dumps({'status': HTTPStatus.BAD_REQUEST, 'message': 'One of numberOfTries, questionId, or answer is empty. Invalid arguments format.'})
    
    user_ref = db.collection('Cognito-2nd_Factor_Authentication-Users').document(username)
    
    # Check if answer matches with the response stored in Cognito-2nd_Factor_Authentication-Users
    if user_ref.get().exists:
        user_data = user_ref.get().to_dict()
        # Answers match
        if user_data[questionId].lower() == answer.lower():
            return json.dumps({"status": HTTPStatus.OK, "message": '2nd factor authentication successful'})
        # Answers dont match
        else:
            return json.dumps({'status': HTTPStatus.EXPECTATION_FAILED,  'message': '2nd factor authentication failed'})
    
    return json.dumps({'status': HTTPStatus.UNAUTHORIZED, 'message': 'User data does not exist.'})
