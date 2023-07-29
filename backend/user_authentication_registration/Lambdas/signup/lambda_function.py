import json
import boto3
import os
from http import HTTPStatus

def lambda_handler(event, context):
    try:
        # Create a Cognito Identity Provider client
        client = boto3.client('cognito-idp', region_name="US-EAST-1")

        # Set the user pool ID and client ID
        client_id = os.environ.get('client_id')
        data = json.loads(event['body'])
        email = data['email']
        password = data['password']
        username = data['username']


        # Authenticate the user
        response = client.sign_up(
            ClientId=client_id,
            Username=username,
            Password=password,
            UserAttributes=[
                {
                    'Name': 'email',
                    'Value': email
                }
            ]
        )
        if response.get('CodeDeliveryDetails', {}).get('DeliveryMedium') == 'EMAIL':
        # There was an error signing up the user
            # The user was authenticated successfully
            return {
                        "statusCode": HTTPStatus.OK,
                        "headers": {
                            "Content-Type": "application/json",
                            'Access-Control-Allow-Origin': '*'
                        },
                        "body": json.dumps({"authenticated": True})
                    }
        else:
                        # The user was authenticated successfully
            return {
                        "statusCode": HTTPStatus.BAD_REQUEST,
                        "headers": {
                            "Content-Type": "application/json",
                            'Access-Control-Allow-Origin': '*'
                        },
                        "body": json.dumps({"authenticated": False})
                    }
    except client.exceptions.UsernameExistsException as e:
                    # The user was authenticated successfully
            return {
                        "statusCode": HTTPStatus.BAD_REQUEST,
                        "headers": {
                            "Content-Type": "application/json",
                            'Access-Control-Allow-Origin': '*'
                        },
                        "body": json.dumps({"authenticated": False,"message":str(e).split(":")[1]})
                    }
    except client.exceptions.InvalidPasswordException as e:
                    # The user was authenticated successfully
            return {
                        "statusCode": HTTPStatus.BAD_REQUEST,
                        "headers": {
                            "Content-Type": "application/json",
                            'Access-Control-Allow-Origin': '*'
                        },
                        "body": json.dumps({"authenticated": False,"message":"Password must have uppercase, lowercase, number and special character"})
                    }
    except Exception as e:
                    # The user was authenticated successfully
            return {
                        "statusCode": HTTPStatus.INTERNAL_SERVER_ERROR,
                        "headers": {
                            "Content-Type": "application/json",
                            'Access-Control-Allow-Origin': '*'
                        },
                        "body": json.dumps({"authenticated": False,"message":str(e)})
                    }
    finally:
        client.close()
