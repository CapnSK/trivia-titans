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
    # Set CORS headers for the preflight request
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

    # Get the request body
    request_json = request.get_json(silent=True)

    if not request_json or 'username' not in request_json:
        return (json.dumps({'status': HTTPStatus.BAD_REQUEST, 'message': 'No username provided. Invalid Arguments!'}), 400, headers)

    # Get the username from the request body
    username = request_json['username']

    if username == '':
        return (json.dumps({'status': HTTPStatus.BAD_REQUEST, 'message': 'Empty username provided. Invalid Argument Format!'}), 400, headers)

    # Get the document from the firestore database
    doc_ref = db.collection(u'Cognito-2nd_Factor_Authentication-Users').document(username)
    doc = doc_ref.get()

    # If the document exists, return true
    if doc.exists:
        return (json.dumps({'status': HTTPStatus.OK, 'message': '2nd Factor Authentication Exists!'}), 200, headers)
    # If the document does not exist, return false
    else:
        return (json.dumps({'status': HTTPStatus.UNAUTHORIZED, 'message': '2nd Factor Authentication Does Not Exist!'}), 401, headers)