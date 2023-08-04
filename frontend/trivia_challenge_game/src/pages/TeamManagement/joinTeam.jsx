import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import axios from "axios";
import { introduce } from "../../util";

import { Box, TextField, Grid, Paper, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import { useParams } from 'react-router-dom';

import TeamDetailTable from './teamDetailTable';
import { AuthContext, ChatContext } from "../../contexts";

function JoinTeam() {
    const { teamId } = useParams();
    const navigate = useNavigate();

    const user = localStorage.getItem("user");
    const username = JSON.parse(user).username;
    const email = JSON.parse(user).email;

    // const { username, email } = useContext(AuthContext);
    // console.log("auth context is ", username, email);

    let { setChatContext } = useContext(ChatContext);

    const [loadingDetails, setLoadingDetails] = useState(true);
    const [teamDetails, setTeamDetails] = useState(undefined);

    console.log(`teamID before useEffect: `, teamId);

    const handleAccept = () => {
        const json_data = {
            teamId: teamId,
            status: "ACCEPTED",
            email: email
        }
        console.log(json_data)
        axios({
            // Endpoint to send files
            url: `${process.env.REACT_APP_APIGATEWAY_URL_ARPIT}/join_team/`,
            method: "POST",
            data: json_data,
        })
            // Handle the response from backend here
            .then((res) => {
                console.log("res: ", res['data'])
                if (res['data'] == true) {
                    setChatContext({
                        email: email,
                        username: username,
                        teamId: teamId,
                        teamName: teamDetails['team_name']
                    })

                    introduce({username, teamId})
                    
                    alert("You have Accepted the request!")
                    navigate("/home")
                }
            })
    }

    useEffect(() => {
        // Fetch team names from the Lambda function

        axios({
            // Endpoint to send files
            url: `${process.env.REACT_APP_APIGATEWAY_URL_ARPIT}/get_team_details/`,
            method: "POST",
            data: { id: teamId },
        })
            // Handle the response from backend here
            .then((res) => {
                console.log(res['data'])
                setTeamDetails(JSON.parse(res['data']));
                setLoadingDetails(false);
            })

    }, []);

    const handleDecline = () => {
        const json_data = {
            teamId: teamId,
            status: "DECLINED",
            email: email
        }
        axios({
            // Endpoint to send files
            url: `${process.env.REACT_APP_APIGATEWAY_URL_ARPIT}/join_team/`,
            method: "POST",
            data: json_data,
        })
            // Handle the response from backend here
            .then((res) => {
                console.log("res: ", res['data'])
                if (res['data'] == true) {
                    alert("You have Declined the request!")
                    navigate("/home")
                }
            })
    }

    // useEffect(() => {

    // }, []);


    return (
        <Grid item alignItems="center" justifyContent="center" xs={12} sm={8} md={4} component={Paper} elevation={6} >
            {loadingDetails && teamDetails === undefined ? (<p>Loading Details ... </p>
            ) : (
                <div>
                    {teamDetails['admin'] && teamDetails['admin']['username'] } invites you to join team {teamDetails['team_name']}
                    <br></br>
                    <Button type="submit"
                        // fullWidth
                        variant="contained"
                        style={{marginLeft: "0.5em"}}
                        sx={{ mt: 3, mb: 2 }} onClick={handleAccept}>Accept</Button>
                    
                    <Button type="submit"
                        // fullWidth
                        variant="contained"
                        style={{marginLeft: "0.5em"}}
                        sx={{ mt: 3, mb: 2 }} onClick={handleDecline}>Decline</Button>
                </div>
            )}

        </Grid>
    );
};

export default JoinTeam;
