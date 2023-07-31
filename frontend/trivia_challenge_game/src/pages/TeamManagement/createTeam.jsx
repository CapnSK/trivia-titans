import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { Box, TextField, Grid, Paper, Button } from "@mui/material";
import { AuthContext } from "../../contexts";
import { useContext } from "react";

const CreateTeam = () => {
	const navigate = useNavigate();
	var teamId;
	
	const user = localStorage.getItem("user");
	const adminUserName = JSON.parse(user).username;
	const adminEmail =  JSON.parse(user).email;

	const json_data = {adminUserName: adminUserName, adminEmail: adminEmail}

	const generateTeamName = async () => {
		// var teamName = "enigma";
		
	
		axios({
			// Endpoint to send files
			url: `${process.env.REACT_APP_APIGATEWAY_URL_ARPIT}/generate_name/`,
			method: "GET",
		})
			// Handle the response from backend here
			.then((res) => {
				console.log(res['data'])
				json_data['teamName'] = res['data']
				handleCreateTeam()
			})
	}
	const handleCreateTeam = async () => {

		axios({
			// Endpoint to send files
			url: `${process.env.REACT_APP_APIGATEWAY_URL_ARPIT}/create_team/`,
			method: "POST",
			data: json_data,
		})
			// Handle the response from backend here
			.then((res) => {
				console.log("res: ", res['data']);
				
				if (res['data'] == "team already exist") {
					alert('Team already exist');
				}
				else {
					teamId = res['data'];
					// navigate("/inviteTeam",  { state: { data: teamId } });
					navigate(`/inviteTeam/${teamId}`)
				}
			});
	};

	useEffect(() => {
			generateTeamName();
	}, []);

	return (
		<div>
			
		</div>
	);
};

export default CreateTeam;
