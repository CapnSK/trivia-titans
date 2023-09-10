# TRIVIA TITANS

## DESCRIPTION

An online multi-player trivia game allowing teammates to collaborate and communicate in real-time and provides up-to-date leaderboards at the end of the match.

#### GETTING STARTED

Note: <small>You will need your own AWS & GCP account to deploy the backend</small>
<ol>
    <li> Fork the repository and clone it in your local machine</li>
    <li> Backend folder has isolated folders for each feature</li>
    <li> Deploy these functions on lambda or Cloud Run</li>
    <li> Create a REST API Gateway endpoint and integrate lambdas</li>
    <li> For in-game-exp & chat you need to create an AWS Websocket API gateway</li>
    <li> Once you are done till step 5, you should be able to test all the endpoints</li>
    <li> Update the .env file in frontend with the API Gateway URLs</li>
    <li> Run the app in your local machine</li>
    <li> Register as a new user and check if your cognito user pool gets updated</li>
    <li>If you are able to register successfully then you can login and start using the app</li>
</ol>

#### SCREENSHOTS

<b>In Game Chat</b>
<img src="screenshots\chat\9PrivateMessage.png"></img>