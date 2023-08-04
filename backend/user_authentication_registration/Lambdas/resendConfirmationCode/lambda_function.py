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
        username = data['username']


        # Authenticate the user
        response = client.resend_confirmation_code(
            ClientId=client_id,
            Username=username
        )
        if response.get('CodeDeliveryDetails', {}).get('DeliveryMedium', '') == 'EMAIL':
            # The confirm email code resent successfully
            return {
                        "statusCode": HTTPStatus.OK,
                        "headers": {
                            "Content-Type": "application/json",
                            'Access-Control-Allow-Origin': '*'
                        },
                        "body": json.dumps({"authenticated": True})
                    }
        else:
                        # confirm email code not sent while signing up the user
            return {
                        "statusCode": HTTPStatus.BAD_REQUEST,
                        "headers": {
                            "Content-Type": "application/json",
                            'Access-Control-Allow-Origin': '*'
                        },
                        "body": json.dumps({"authenticated": False})
                    }
    except client.exceptions.TooManyRequestsException as e:
                    # Username Already exists Error
            return {
                        "statusCode": HTTPStatus.BAD_REQUEST,
                        "headers": {
                            "Content-Type": "application/json",
                            'Access-Control-Allow-Origin': '*'
                        },
                        "body": json.dumps({"authenticated": False,"message":"Too many requests. Please try again later."})
                    }
    except client.exceptions.LimitExceededException as e:
                    # Password Format Error
            return {
                        "statusCode": HTTPStatus.BAD_REQUEST,
                        "headers": {
                            "Content-Type": "application/json",
                            'Access-Control-Allow-Origin': '*'
                        },
                        "body": json.dumps({"authenticated": False,"message":"You have exceeded the limit for sending the confirmation code. Please contact the help desk."})
                    }
    except Exception as e:
                    # Any other Error
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
