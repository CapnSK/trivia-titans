# There are 2 firestore documents. 
# Cognito-2nd_Factor_Authentication-Questions: has only one document which has 3 predefined questions, with field names Question 1, Question 2, and Question 3.
# Cognito-2nd_Factor_Authentication-Users: has documents named with user's username. If a document exists, it means that the user has set up 2nd factor authentication.

import json
import firebase_admin
from firebase_admin import firestore
import functions_framework
from http import HTTPStatus

# Initialize Firestore DB
# Use the application default credentials
firebase_admin.initialize_app()

db = firestore.client()

@functions_framework.http
def checkIf2ndFactorAuthenticationExists(request):
    # Get the request body
    request_json = request.get_json(silent=True)

    if not request_json or 'username' not in request_json:
        return json.dumps({'status': HTTPStatus.BAD_REQUEST, 'message': 'No username provided. Invalid Arugments!'})

    # Get the username from the request body
    username = request_json['username']

    if username == '':
        return json.dumps({'status': HTTPStatus.BAD_REQUEST, 'message': 'Empty username provided. Invalid Arugment Format!'})

    # Get the document from the firestore database
    doc_ref = db.collection(u'Cognito-2nd_Factor_Authentication-Users').document(username)
    doc = doc_ref.get()

    # If the document exists, return true
    if doc.exists:
        return json.dumps({'status': HTTPStatus.OK, 'message': '2nd Factor Authentication Exists!'})
    # If the document does not exist, return false
    else:
        return json.dumps({'status': HTTPStatus.UNAUTHORIZED, 'message': '2nd Factor Authentication Does Not Exist!'})
    