import json
import boto3
import os
from http import HTTPStatus

def lambda_handler(event, context):
    # Set the user pool ID and client ID
    # user_pool_id = 'us-east-1_NVngRgBBm'
    USER_POOL_ID = os.environ.get('user_pool_id')
    CLIENT_ID = os.environ.get('client_id')
    client = boto3.client('cognito-idp', region_name="US-EAST-1")
    try:
        # Create a Cognito Identity Provider client

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
    except client.exceptions.AliasExistsException as e:
    # Return a response indicating that the user already exists
        return {
            "statusCode": HTTPStatus.CONFLICT,
            "headers": {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*'
            },
            "body": json.dumps({"authenticated": False, "message": "User with this email already exists. Try logging in."})
        }
    except client.exceptions.CodeMismatchException as e:
        return {
                "statusCode": HTTPStatus.NOT_FOUND,
                "headers": {
                    "Content-Type": "application/json",
                    'Access-Control-Allow-Origin': '*'
                },
                "body": json.dumps({"authenticated": False, "message": "Invalid verification code."})
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