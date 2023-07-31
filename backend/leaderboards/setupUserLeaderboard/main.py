import json
import functions_framework
from http import HTTPStatus

@functions_framework.http
def setupUserLeaderboard(request):
    # Set CORS headers for the preflight request
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

    # Get the request body
    return (json.dumps({'status': HTTPStatus.UNAUTHORIZED, 'message': '2nd Factor Authentication Does Not Exist!'}), 401, headers)