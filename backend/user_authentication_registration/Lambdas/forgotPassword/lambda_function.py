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
        print("Hit "+ username)
        # Authenticate the user using the provided email and password
        # ...
        # Authenticate the user
        response = client.forgot_password(
            ClientId=CLIENT_ID,
            Username=username,
        )

        if response.get('CodeDeliveryDetails', {}).get('DeliveryMedium') == 'EMAIL':
        # There was an error signing up the user
            return {
                "statusCode": HTTPStatus.OK,
                "headers": {
                    "Content-Type": "application/json",
                    'Access-Control-Allow-Origin': '*'
                },
                "body": json.dumps({"authenticated": True, 'maskedEmail': response.get('CodeDeliveryDetails').get('Destination')})
            }
        else:
            return {
                    "statusCode": HTTPStatus.NOT_FOUND,
                    "headers": {
                        "Content-Type": "application/json",
                    'Access-Control-Allow-Origin': '*'
                    },
                    "body": json.dumps({"authenticated": False})
                }
    except Exception as e:
        return {
                "statusCode": HTTPStatus.INTERNAL_SERVER_ERROR,
                "headers": {
                    "Content-Type": "application/json",
                    'Access-Control-Allow-Origin': '*'
                },
                "body": json.dumps({"authenticated": False, "message": str(e)})
            }
    finally:
        client.close()
