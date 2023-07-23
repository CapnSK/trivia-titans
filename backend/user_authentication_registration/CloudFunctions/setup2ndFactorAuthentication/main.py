# There are 2 firestore documents. 
# Cognito-2nd_Factor_Authentication-Questions: has only one document which has 3 predefined questions, with field names Question 1, Question 2, and Question 3.
# Cognito-2nd_Factor_Authentication-Users: has documents named with user's username. If a document exists, it means that the user has set up 2nd factor authentication.
# This function has a get method, which returns all the questions from the Cognito-2nd_Factor_Authentication-Questions document.
# This function also has a post method, which takes in the user's username, and the answers to the questions, and stores them in the Cognito-2nd_Factor_Authentication-Users document. 

import json
import firebase_admin
from firebase_admin import firestore
import functions_framework
from http import HTTPStatus

# Use the application default credentials
firebase_admin.initialize_app()

# Initialize Firestore DB
db = firestore.client()

@functions_framework.http
def setup2ndFactorAuthentication(request):
    if request.method == 'OPTIONS':
        # Handle preflight requests for CORS
        if request.method == 'OPTIONS':
            headers = {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '3600'
            }
            return ('', 204, headers)

    # Set CORS headers for the main request
    headers = {
        'Access-Control-Allow-Origin': '*'
    }

    if request.method == 'GET':
        # Get all the questions from the Cognito-2nd_Factor_Authentication-Questions document
        questions_ref = db.collection('Cognito-2nd_Factor_Authentication-Questions')
        questions = questions_ref.stream()
        response_data = next(questions).to_dict()
        return (json.dumps(response_data), 200, headers)

    elif request.method == 'POST':
        # Get the user's username and answers to the questions from the request body
        request_json = request.get_json()
        
        if not request_json or 'username' not in request_json or 'answer1' not in request_json or 'answer2' not in request_json or 'answer3' not in request_json:
            return (json.dumps({'status': HTTPStatus.BAD_REQUEST, 'message': 'username, answer1, answer2, and answer3 are required. Invalid Arguments.'}), 400, headers)

        username = request_json['username'] 
        answer1 = request_json['answer1']
        answer2 = request_json['answer2']
        answer3 = request_json['answer3']

        if username == "" or answer1 == "" or answer2 == "" or answer3 == "":
            return (json.dumps({'status': HTTPStatus.BAD_REQUEST, 'message': 'One of username, answer1, answer2, or answer3 is empty. Invalid arguments format.'}), 400, headers)

        user_ref = db.collection('Cognito-2nd_Factor_Authentication-Users').document(username)

        # check if document already exists, and answers are already set up in the document
        if user_ref.get().exists:
            user_data = user_ref.get().to_dict()
            if user_data['Question 1'] not in (None, "") or user_data['Question 2'] not in (None, "") or user_data['Question 3'] not in (None, ""):
                return (json.dumps({'status': HTTPStatus.ALREADY_REPORTED, 'message': '2nd factor authentication already set up for this user'}), 208, headers)
            
        # Store the answers in the Cognito-2nd_Factor_Authentication-Users document
        user_ref.set({
            'Question 1': answer1,
            'Question 2': answer2,
            'Question 3': answer3
        })
        return (json.dumps({'status': HTTPStatus.OK, 'message': '2nd factor authentication set up successfully'}), 200, headers)