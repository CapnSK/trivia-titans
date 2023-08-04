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
        client_id = os.environ.get('client_id')
        data = json.loads(event['body'])
        email = data['email']
        password = data['password']
        print("Hit "+ email+ ", " + password)
        # Authenticate the user using the provided email and password
        # ...
        # Authenticate the user
        response = client.initiate_auth(
            AuthFlow='USER_PASSWORD_AUTH',
            AuthParameters={
                'USERNAME': email,
                'PASSWORD': password
            },
            ClientId=client_id
        )
        try:
            # Check if the user was authenticated successfully
            if response['ChallengeName'] == 'NEW_PASSWORD_REQUIRED':
                # The user is required to set a new password
                # You can handle this case in your app
                pass
        except KeyError:
            pass
        if 'AuthenticationResult' in response:
            # The user was authenticated successfully
            # You can access the user's tokens in response['AuthenticationResult']
            access_token = response['AuthenticationResult']['AccessToken']
            id_token = response['AuthenticationResult']['IdToken']
            
            # Get the user's information from Cognito records
            user_info = client.get_user(
                AccessToken=access_token
            )
            
            username = user_info['Username']
            email = [attr['Value'] for attr in user_info['UserAttributes'] if attr['Name'] == 'email'][0]
            roleArray = [attr['Value'] for attr in user_info['UserAttributes'] if attr['Name'] == 'custom:Role']
            if len(roleArray) > 0:
                role = roleArray[0]
            else:
                role = "player"
            
            return {
                        "statusCode": HTTPStatus.OK,
                        "headers": {
                            "Content-Type": "application/json",
                            'Access-Control-Allow-Origin': '*'
                        },
                        "body": json.dumps({
                                    "authenticated": True,
                                    'access_token': access_token,
                                    'id_token': id_token,
                                    'username': username,
                                    'email': email,
                                    'role': role
                        })
                    }
        else:
            # There was an error authenticating the user
            return {
                        "statusCode": HTTPStatus.NOT_FOUND,
                        "headers": {
                            "Content-Type": "application/json",
                            'Access-Control-Allow-Origin': '*'
                        },
                        "body": json.dumps({"authenticated": False})
                    }
    except client.exceptions.NotAuthorizedException as e:
        return {
                "statusCode": HTTPStatus.NOT_FOUND,
                "headers": {
                    "Content-Type": "application/json",
                    'Access-Control-Allow-Origin': '*'
                },
                "body": json.dumps({"authenticated": False, "message": str(e).split(":")[1]})
            }

    except client.exceptions.UserNotConfirmedException as e:
        return {
                "statusCode": HTTPStatus.UNAUTHORIZED,
                "headers": {
                    "Content-Type": "application/json",
                    'Access-Control-Allow-Origin': '*'
                },
                "body": json.dumps({"authenticated": False, "message": "User is not confirmed."})
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