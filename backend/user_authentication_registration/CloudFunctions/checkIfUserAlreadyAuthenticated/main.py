# There are 2 firestore documents. 

import json
import firebase_admin
from firebase_admin import firestore
import functions_framework
from http import HTTPStatus
import cognitojwt
import logging
import boto3

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Use the application default credentials
firebase_admin.initialize_app()

# Initialize Firestore DB
db = firestore.client()

# User Pool ID
USER_POOL_ID = 'us-east-1_U52XbrNPE'

@functions_framework.http
def checkIfUserAlreadyAuthenticated(request):
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

    if request.method == 'POST':
        # Get the user's username and answers to the questions from the request body
        request_json = request.get_json()

        if not request_json or 'tokenId' not in request_json:
            return (json.dumps({'status': HTTPStatus.BAD_REQUEST, 'message': 'token id is required. Invalid Arguments.'}), 400, headers)

        tokenId = request_json['tokenId'] 

        if tokenId in (None, ""):
            return (json.dumps({'status': HTTPStatus.BAD_REQUEST, 'message': 'token id is empty. Invalid arguments format.'}), 400, headers)

        # Verify the token id
        try:
            claims = cognitojwt.decode(tokenId, region='us-east-1', userpool_id=USER_POOL_ID)
        except Exception as e:
            logger.error(e)
            return (json.dumps({'status': HTTPStatus.UNAUTHORIZED, 'message': 'Authentication expired, need to authenticate again!'}), 401, headers)

        return (json.dumps({'status': HTTPStatus.OK, 'message': 'Already Authenticated...'}), 200, headers)