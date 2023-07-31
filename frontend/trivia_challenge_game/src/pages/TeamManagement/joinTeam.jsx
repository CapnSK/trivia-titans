import React, { useEffect, useLayoutEffect, useState } from "react";
import axios from "axios";
import { Box, TextField, Grid, Paper, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import { useParams } from 'react-router-dom';

import TeamDetailTable from './teamDetailTable';

function JoinTeam() {

    const { teamId } = useParams();
    const navigate = useNavigate();

    const user = localStorage.getItem("user");
    const userName = JSON.parse(user).username;
    const email = JSON.parse(user).email;

    console.log(`teamID before useEffect: `, teamId);

    const handleAccept = () => {
        const json_data = {
            teamId: teamId,
            status: "ACCEPTED",
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
                    alert ("You have Accepted the request!")
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
			data: {  },
		})
			// Handle the response from backend here
			.then((res) => {
				res['data'].unshift("Select a Team")
				console.log(res)
				setTeamNames(res['data']);
				setLoadingTeams(false);
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
                    alert ("You have Declined the request!")
                    navigate("/home")
                }
            })
    }

    // useEffect(() => {

    // }, []);


    return (
        <Grid item alignItems="center" justifyContent="center" xs={12} sm={8} md={4} component={Paper} elevation={6} >
            {loadingDetails ? (<p>Loading Details ... </p>
            ) : (
                <div>

                    <Button type="submit"
                        // fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }} onClick={handleAccept}>Accept</Button>
                        <br></br>
                    <Button type="submit"
                        // fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }} onClick={handleDecline}>Decline</Button></div>
            ) }
            
        </Grid>
    );
};

export default JoinTeam;
