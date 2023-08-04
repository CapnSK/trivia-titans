import json
import boto3
import os
from http import HTTPStatus
import urllib3



def lambda_handler(event, context):
    try:

        CLIENT_ID = os.environ.get('client_id')

        USER_POOL_ID = os.environ.get('user_pool_id')
    
        # Set the token endpoint URL
        
        TOKEN_URL = 'https://trivia-challenge-game.auth.us-east-1.amazoncognito.com/oauth2/token'
    
        # Get the authorization code from the request body
        # data = json.loads(event['body'])
        
        # Authorization code
        code = event['code']
    
        # Create a dictionary of request parameters
        params = {
            'grant_type': 'authorization_code',
            'client_id': CLIENT_ID,
            'code': code,
            'redirect_uri': 'https://frontend-at3rcdcdla-ue.a.run.app/unauth/login'
        }
    
        # Create a dictionary of request headers
        headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        
        requests = urllib3.PoolManager()
        
        # Make the POST request to the token endpoint
        response = requests.request('POST', TOKEN_URL, fields=params, headers=headers)
    
        # Parse the JSON response
        tokens = json.loads(response.data.decode('utf-8'))
        
        print(tokens)
        # Get the access token and ID token from the response
        access_token = tokens['access_token']
        id_token = tokens['id_token']

        # The user was signed up successfully
        return {
                "statusCode": HTTPStatus.OK,
                "headers": {
                    "Content-Type": "application/json",
                    'Access-Control-Allow-Origin': '*'
                },
                "body": json.dumps({"authenticated": True, "access_token":access_token, "id_token":id_token})
            }

    except Exception as e:
        return {
                "statusCode": HTTPStatus.NOT_FOUND,
                "headers": {
                    "Content-Type": "application/json",
                    'Access-Control-Allow-Origin': '*'
                },
                "body": json.dumps({"authenticated": False, "message": str(e)})
            }