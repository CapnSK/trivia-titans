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
        password = data['password']        
        code = data['code']        
        
        # Authenticate the user
        response = client.confirm_forgot_password(
            ClientId=CLIENT_ID,
            Username=username,
            ConfirmationCode= code,
            Password=password
        )

        return {
                "statusCode": HTTPStatus.OK,
                "headers": {
                    "Content-Type": "application/json",
                    'Access-Control-Allow-Origin': '*'
                },
                "body": json.dumps({"authenticated": True})
        }
    except (client.exceptions.ExpiredCodeException, client.exceptions.CodeMismatchException) as e:
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
