import React, { useState } from "react";
import axios from "axios";
import { Box, TextField, Grid, Paper, Button } from "@mui/material";
import { useLocation } from "react-router-dom";

const InviteTeam = () => {
	const [invitedEmails, setInvitedEmails] = useState([]);
	// const { teamId } = props.location.state;

	// Destructure the location prop
	const props = useLocation()
	console.log(props['state']['data'])

	// Check if the location object exists and has the state property
	// const teamId = location && location.state ? location.state.data : null;
	
	// console.log(teamId);

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
			id: props['state']['data'],
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
			});
	};

	// Function to handle adding a new email address to the invitedEmails state
	const handleAddEmail = (e) => {
		// e.preventDefault();
		// const email = e.target.value;
		// setInvitedEmails((prevEmails) => [...prevEmails, email]);
		// e.target.value = "";
	};

	return (
		<Grid item xs={12} sm={8} md={4} component={Paper} elevation={6} square>
			{/* <h2>Invite Users to Join Your Team</h2>
			<form onSubmit={handleSubmit}>
				<label>
					Email:
					<input
						id="email"
						label="Email Address"
						name="email"
						autoComplete="email"
						type="email"
						onChange={handleAddEmail}
					/>
				</label>
				<button type="submit">Send Invitation</button>
			</form>
			<h3>Invited Users:</h3>
			<ul>
				{invitedEmails.map((email, index) => (
					<li key={index}>{email}</li>
				))}
			</ul> */}

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
					submit
				</Button>
			</Box>
		</Grid>
	);
};

export default InviteTeam;
