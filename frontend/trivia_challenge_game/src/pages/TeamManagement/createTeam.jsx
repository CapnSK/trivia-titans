import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { Box, TextField, Grid, Paper, Button } from "@mui/material";

const CreateTeam = () => {
	const navigate = useNavigate();
	const handleCreateTeam = () => {
		var teamName;

		// // Generate Team name from chatGPT lambda function
		// axios({
		// 	// Endpoint to send files
		// 	url: `${process.env.REACT_APP_APIGATEWAY_URL}/generate_name/`,
		// 	method: "GET",
		// })
		// 	// Handle the response from backend here
		// 	.then((res) => {
		// 		console.log("res: ", res);
		// 		teamName = res;
		// 	});

		teamName = "enigma";

		axios({
			// Endpoint to send files
			url: `${process.env.REACT_APP_APIGATEWAY_URL}/create_team/`,
			method: "POST",
			data: { teamName: teamName },
		})
			// Handle the response from backend here
			.then((res) => {
				console.log("res: ", res);
				if (res.status == 200) {
					navigate("/inviteTeam");
				}
			});
	};
	return (
		<div>
			<Button onClick={handleCreateTeam}>Create Team</Button>
		</div>
	);
};

export default CreateTeam;
