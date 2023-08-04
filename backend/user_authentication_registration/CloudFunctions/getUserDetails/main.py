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
region = 'us-east-1'
client = boto3.client('cognito-idp', region_name=region)

@functions_framework.http
def getUserDetails(request):
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
        
        # Get the user's username and answers to the questions from the request body
        if (not request_json or 'accessToken' not in request_json):
            return (json.dumps({'status': HTTPStatus.BAD_REQUEST, 'message': 'access token is required. Invalid Arguments.'}), 400, headers)
        accessToken = request_json['accessToken']
        if accessToken in (None, ""):
            return (json.dumps({'status': HTTPStatus.BAD_REQUEST, 'message': 'access token is empty. Invalid arguments format.'}), 400, headers)
        
        try:
            response = client.get_user(
                AccessToken=accessToken
            )
            # get username and email from response
            username = response['Username']
            for userAttribute in response['UserAttributes']:
                email = userAttribute['Value'] if userAttribute['Name'] == 'email' else None
                role = userAttribute['Value'] if userAttribute['Name'] == 'custom:Role' else "player"
            return (json.dumps({"status": HTTPStatus.OK, "username":username, "email": email, "role": role}), 200, headers)
        except Exception as e:
            logger.error(e)
            return (json.dumps({'status': HTTPStatus.UNAUTHORIZED, 'message': 'Authentication expired, need to authenticate again!'}), 401, headers)
        