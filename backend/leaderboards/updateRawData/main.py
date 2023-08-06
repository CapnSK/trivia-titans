import json
import requests
import functions_framework
from google.cloud import firestore
from http import HTTPStatus
from datetime import datetime

@functions_framework.http
def updateRawData(request):
    # Set CORS headers for the preflight request
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }
        return ('', HTTPStatus.NO_CONTENT, headers)
    
    # Set CORS headers for the main request
    headers = {
        'Access-Control-Allow-Origin': '*'
    }

    if request.method == "POST":
        # Initialize Firestore DB
        db = firestore.Client()
        teams_ref = db.collection('Raw_Data')

        # Get the request body
        data = request.get_json(silent=True)
        
        # Check if team_id and admin are not null
        valid_teams = [team for team in data if team.get('team_id') not in (None, "") and team.get('admin') not in (None, "")]

        print('Valid teams: {}'.format(valid_teams))

        if not valid_teams:
            return (json.dumps({'status': HTTPStatus.BAD_REQUEST, 'message': 'No valid teams provided. Invalid Arguments!'}), HTTPStatus.BAD_REQUEST, headers)
        
        # Create a list of team_ids
        team_ids = [team['team_id'] for team in valid_teams]
        
        # Send request to API
        api_url = 'https://mimooazyk3.execute-api.us-east-1.amazonaws.com/first/getuserprofile'
        api_response = requests.post(api_url, json={'team_id': team_ids})
        
        print('API response: {}'.format(api_response))

        # Parse API response
        matches_data = json.loads(api_response.text)

        # print(matches_data)
        
        # Group matches by team_id
        matches_by_team = {}
        for match in matches_data:
            team_id = match['team_id']
            if team_id not in matches_by_team:
                matches_by_team[team_id] = []
        
        for match in matches_data:
            team_id = match['team_id']
            # new dictionary with only required fields
            new_match = {}
            new_match['match_instance_id'] = match['match_instance_id']
            new_match['score'] = int(match['score'])
            new_match['timestamp_created'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            new_match['win'] = True if match['win'] == 'true' else False
            new_match['category'] = match['match_config']['category']
            new_match['trivia_name'] = match['match_config']['trivia_name']
            # append to list
            matches_by_team[team_id].append(new_match)


        print('Matches by team: {}'.format(matches_by_team))

        # Update Firestore collection
        for team in valid_teams:
            team_id = team['team_id']
            doc_ref = teams_ref.document(str(team_id))
            doc = doc_ref.get()
            
            if not doc.exists:
                # Create new document
                new_data = {
                    'members': {
                        'admin': team['admin'],
                        'team_members': team['members']
                    },
                    'team_name': team['team_name'],
                    'matches': matches_by_team.get(team_id, [])
                }
                doc_ref.set(new_data)
            else:
                # Update existing document

                # Check if team_name has changed
                team_name = doc.to_dict().get('team_name', '')
                if team_name != team['team_name']:
                    # Update team_name in Firestore
                    doc_ref.update({'team_name': team['team_name']})
                
                # Check if admin has changed
                admin = doc.to_dict().get('members', {}).get('admin', '')
                if admin != team['admin']:
                    # Update admin in Firestore
                    doc_ref.update({'members.admin': team['admin']})
                
                # Check if team_members have changed
                existing_members = doc.to_dict().get('members', {}).get('team_members', [])
                new_members = []
                for member in team['members']:
                    if member not in existing_members:
                        new_members.append(member)
                if new_members:
                    # Update team_members in Firestore without erasing or modifying existing members
                    doc_ref.update({'members.team_members': firestore.ArrayUnion(new_members)})

                # Check if matches have changed (New matches have been played since last update)
                existing_matches = doc.to_dict().get('matches', [])
                existing_match_ids = [match['match_instance_id'] for match in existing_matches]
                new_matches = [match for match in matches_by_team.get(team_id, []) if match['match_instance_id'] not in existing_match_ids]
                if new_matches:
                    # Update matches array in Firestore without erasing or modifying or duplicating existing matches
                    doc_ref.update({'matches': firestore.ArrayUnion(new_matches)})


        # Create a list of all usernames to return
        usernames = []
        for team in valid_teams:
            usernames.extend(team['members'])
            usernames.append(team['admin'])

        print('Usernames: {}'.format(usernames))

        # get a list of emails for all the usernames from the API
        api_url = "https://21xui8kvw5.execute-api.us-east-1.amazonaws.com/prod/checkifuserexists"

        # Pass one username at a time to the API
        emails = []
        for username in usernames:
            api_response = requests.post(api_url, json={'username': username})
            print(api_response)
            if api_response.status_code == 200:
                # Parse API response that looks like this
                # {
                #     "body": "abhinava465@gmail.com",
                #     "status": true
                # }
                api_response = json.loads(api_response.text)
                if api_response['status']:
                    emails.append(api_response['body'])
            else:
                pass
        
        # Pass this as an input to a lambda function to send emails
        lambda_url = "https://dpovc3ameb.execute-api.us-east-1.amazonaws.com/trivia/send_email"
        subject = "Trivia Challenge Game: Leaderboard Updated"
        message = "The leaderboard has been updated. Please check the leaderboard to see your current rank."
        payload = {
            'emails': emails,
            'subject': subject,
            'message': message
        }
        lambda_response = requests.post(lambda_url, json=payload)
        print(lambda_response)

        return (json.dumps({'status': HTTPStatus.OK, 'message': 'Raw data updated successfully! Leaderboard Updated! Users Notified!'}), HTTPStatus.OK, headers)