# There are 2 firestore documents. 

import json
import boto3
import os
from http import HTTPStatus

def lambda_handler(event, context):
    try:
        # Create a Cognito Identity Provider client
        client = boto3.client('cognito-idp', region_name="US-EAST-1")

        # Set the user pool ID and client ID
        # user_pool_id = 'us-east-1_NVngRgBBm'
        CLIENT_ID = os.environ.get('client_id')
        USER_POOL_ID = os.environ.get('user_pool_id')
        data = json.loads(event['body'])
        username = data['username']
        print("Hit "+ username)
        # Authenticate the user using the provided email and password
        # ...
        # Authenticate the user
        response = client.admin_get_user(
                UserPoolId=USER_POOL_ID,
                Username=username
        )

        # Extract the email from the response
        email = None
        for attribute in response['UserAttributes']:
            if attribute['Name'] == 'email':
                email = attribute['Value']
                break


        return {
                "statusCode": HTTPStatus.OK,
                "headers": {
                    "Content-Type": "application/json",
                    'Access-Control-Allow-Origin': '*'
                },
                "body": json.dumps({"body": email, "status": True})
            }

    except Exception as e:
        return {
                "statusCode": HTTPStatus.INTERNAL_SERVER_ERROR,
                "headers": {
                    "Content-Type": "application/json",
                    'Access-Control-Allow-Origin': '*'
                },
                "body": json.dumps({"status": False, "body": str(e)})
            }
    finally:
        client.close()
