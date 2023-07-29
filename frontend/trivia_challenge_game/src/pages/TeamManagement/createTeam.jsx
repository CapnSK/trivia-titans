import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { Box, TextField, Grid, Paper, Button } from "@mui/material";

const CreateTeam = () => {
	const navigate = useNavigate();
	const handleCreateTeam = () => {
		var teamName = "enigma";
		var teamId;
		const json_data = {teamName: "enigma", adminUserName: "arpitkumar", adminEmail: "arpit@gmail.com"}

		console.log(`${process.env.REACT_APP_APIGATEWAY_URL}/create_team/`)

		axios({
			// Endpoint to send files
			url: `${process.env.REACT_APP_APIGATEWAY_URL}/create_team/`,
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
	return (
		<div>
			<Button onClick={handleCreateTeam}>Create Team</Button>
		</div>
	);
};

export default CreateTeam;
