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
        data = json.loads(event['body'])
        username = data['username']
        code = data['code']
        print("Hit "+ username+ ", " + code)
        # Authenticate the user using the provided email and password
        # ...
        # Authenticate the user
        response = client.confirm_sign_up(
            ClientId=CLIENT_ID,
            Username=username,
            ConfirmationCode=code,
        )

        # The user was signed up successfully
        return {
                "statusCode": HTTPStatus.OK,
                "headers": {
                    "Content-Type": "application/json",
                    'Access-Control-Allow-Origin': '*'
                },
                "body": json.dumps({"authenticated": True})
            }
    except client.exceptions.CodeMismatchException as e:
        return {
                "statusCode": HTTPStatus.NOT_FOUND,
                "headers": {
                    "Content-Type": "application/json",
                    'Access-Control-Allow-Origin': '*'
                },
                "body": json.dumps({"authenticated": False, "message": str(e).split(":")[1]})
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
    finally:
        client.close()