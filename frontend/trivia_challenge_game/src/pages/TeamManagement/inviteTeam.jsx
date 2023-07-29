import React, { useEffect, useLayoutEffect, useState } from "react";
import axios from "axios";
import { Box, TextField, Grid, Paper, Button } from "@mui/material";
import { useLocation } from "react-router-dom";

import { useParams } from 'react-router-dom';

import TeamDetailTable from './teamDetailTable';

function InviteTeam() {
	const [invitedEmails, setInvitedEmails] = useState([]);
	const [jsonTeamData, setJsonTeamData] = useState({});
	const [loading, setLoading] = useState(true);

	// const { teamId } = props.location.state;

	// Destructure the location prop
	// const props = useLocation()
	// console.log(props['state']['data'])

	const { teamId } = useParams();

	console.log(`teamID before useEffect: `, teamId);

	

	
	// Check if the location object exists and has the state property
	// const teamId = location && location.state ? location.state.data : null;
	
	// console.log(teamId);

	const getTeamDetail = ()=> {
		console.log("in getTeamDetails")
		axios({
			// Endpoint to send files
			url: `${process.env.REACT_APP_APIGATEWAY_URL}/get_team_details`,
			method: "POST",
			data: {id: teamId},
		})
			// Handle the response from backend here
			.then((res) => {
				const jsonResData = JSON.parse(res['data'])
					console.log(jsonResData)
					console.log(typeof(jsonResData))
					setJsonTeamData(jsonResData)
					setLoading(false);
				}
			)
	}

	const handleSubmitForm = (event) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		console.log(data);
		console.log(data.get("email"));
		/**
		 * Creates a JSON object with the email and password values from the given FormData object.
		 * @param {{FormData}} data - The FormData object containing the email and password values.
		 * @returns A JSON object with the email and password values.
		 */
		const data_json = {
			// id: props['state']['data'],
			id: teamId,
			userName: "xyz",
			email: data.get("email"),
		};

		/**
		 * Sends a POST request to the specified URL with the given data and handles the response.
		 * @param {{string}} url - The URL to send the request to.
		 * @param {{object}} data_json - The data to send with the request in JSON format.
		 */
		console.log("Below");
		console.log(`${process.env.REACT_APP_APIGATEWAY_URL}/invitation`);
		axios({
			// Endpoint to send files
			url: `${process.env.REACT_APP_APIGATEWAY_URL}/invitation`,
			method: "POST",
			data: data_json,
		})
			// Handle the response from backend here
			.then((res) => {
				console.log("res: ", res['data']);
				if (res['data'] == "member exist") {
					alert("Member already exist")
				}
				else if (res['data'] == "number exceed") {
					alert("Maximum send invitation limit exceed (4 invitations only)")
				}
				else {

				}
				getTeamDetail();
			});
	};

	// Function to handle adding a new email address to the invitedEmails state
	const handleAddEmail = (e) => {
		// e.preventDefault();
		// const email = e.target.value;
		// setInvitedEmails((prevEmails) => [...prevEmails, email]);
		// e.target.value = "";
	};

	// useEffect(() => {
	// 	// Fetch data after component mount and set interval to update data every second
	// 	getTeamDetail();
	// }, []);

	// useEffect(() => {
	// 	// This effect will run every time MyComponent re-renders
	// 	console.log('useEffect is called.');
	// 	getTeamDetail();
	// }, [teamId]);

	useLayoutEffect(() => {
        //check local token or something
		console.log('useLayoutEffect is called.');
		getTeamDetail();
    }, [teamId]);

	return (
		<Grid item xs={12} sm={8} md={4} component={Paper} elevation={6} square>
			{loading ? (
				<p>Loading... {console.log("in loading")}</p>
			) : (
				<div>
					{console.log("in else")}
				<Box
					component="form"
					// noValidate
					onSubmit={handleSubmitForm}
					sx={{ mt: 1 }}>
					<TextField
						margin="normal"
						required
						fullWidth
						id="email"
						label="Email Address"
						name="email"
						autoComplete="email"
						autoFocus
					/>

					<Button
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 2 }}>
						Send Invitation
					</Button>
				</Box>

				<h2>Team Details</h2>
				{console.log(jsonTeamData)}
				{console.log(typeof(jsonTeamData))}
				<TeamDetailTable jsonData={jsonTeamData} />
				</div>
			)}
		</Grid>
	);
};

export default InviteTeam;
