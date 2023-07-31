import React, { useEffect, useLayoutEffect, useState } from "react";
import axios from "axios";
import { Box, TextField, Grid, Paper, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import { useParams } from 'react-router-dom';

import TeamDetailTable from './teamDetailTable';

function ManageTeam() {
	const [teamNames, setTeamNames] = useState([]);
	const [selectedTeamName, setSelectedTeamName] = useState('');

	const navigate = useNavigate();

	const user = localStorage.getItem("user");
	const adminUserName = JSON.parse(user).username;
	const adminEmail = JSON.parse(user).email;

	const [invitedEmails, setInvitedEmails] = useState([]);
	const [jsonTeamData, setJsonTeamData] = useState({});
	const [loading, setLoading] = useState(true);
	const [loadingTeamDetails, setLoadingTeamDetails] = useState(true);


	// const { teamId } = useParams();

	// console.log(`teamID before useEffect: `, teamId);

	// const additionalData = {
	// 	team_name: selectedTeamName
	// };


	const getTeamDetail = (teamName) => {
		console.log("in getTeamDetails")
		if (teamName != "Select a Team") {
			console.log(teamName)
			console.log(`${process.env.REACT_APP_APIGATEWAY_URL_ARPIT}/get_team_details`)
			axios({
				// Endpoint to send files
				url: `${process.env.REACT_APP_APIGATEWAY_URL_ARPIT}/get_team_details`,
				method: "POST",
				data: { team_name: teamName },
			})
				// Handle the response from backend here
				.then((res) => {
					const jsonResData = JSON.parse(res['data'])
					setJsonTeamData(jsonResData)
					setLoadingTeamDetails(false);
				}
				)
		}
		else {
			setLoadingTeamDetails(true);
			// setLoading(true);
		}
	}

	const handleSubmitForm = (event) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		/**
		 * Creates a JSON object with the email and password values from the given FormData object.
		 * @param {{FormData}} data - The FormData object containing the email and password values.
		 * @returns A JSON object with the email and password values.
		 */

		const data_json = {
			// id: props['state']['data'],
			team_name: selectedTeamName,
			userName: "xyz",
			email: data.get("email"),
		};

		/**
		 * Sends a POST request to the specified URL with the given data and handles the response.
		 * @param {{string}} url - The URL to send the request to.
		 * @param {{object}} data_json - The data to send with the request in JSON format.
		 */
		console.log("Below");
		axios({
			// Endpoint to send files
			url: `${process.env.REACT_APP_APIGATEWAY_URL_ARPIT}/invitation`,
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
				getTeamDetail(selectedTeamName);
			});
	};

	// Function to handle adding a new email address to the invitedEmails state
	const handleAddEmail = (e) => {

	};


	const handleDropdownChange = (event) => {
		console.log(event.target.value);

		setSelectedTeamName(event.target.value);
		console.log(selectedTeamName);
		getTeamDetail(event.target.value);
	};

	useEffect(() => {
		// Fetch team names from the Lambda function

		axios({
			// Endpoint to send files
			url: `${process.env.REACT_APP_APIGATEWAY_URL_ARPIT}/get_created_team/`,
			method: "POST",
			data: { email: adminEmail },
		})
			// Handle the response from backend here
			.then((res) => {
				res['data'].unshift("Select a Team")
				console.log(res)
				setTeamNames(res['data']);
				setLoading(false);
			})
	}, []);


	// useLayoutEffect(() => {
	// 	//check local token or something
	// 	console.log('useLayoutEffect is called.');
	// 	getTeamDetail();
	// }, [teamId]);

	return (
		<Grid item alignItems="center" justifyContent="center" xs={12} sm={8} md={4} component={Paper} elevation={6} >
			<button onClick={() => { navigate("/createTeam") }}>
				Create new Team
			</button>
			<br></br>
			<br></br>
			{loading ? (
				<p>Loading... {console.log("in loading")}</p>
			) : (
				<div>
					Your Team: <select value={selectedTeamName} onChange={handleDropdownChange}>
						{console.log(`before the map: ${teamNames}`)}
						{teamNames.map((name, index) => (

							<option key={index} value={name}>{name}</option>
						))}
					</select>
					{/* Render the selected name on the page */}
					{/* {selectedTeamName && <p>Selected Team Name: {selectedTeamName}</p>} */}
				</div>
			)
			}
			{loadingTeamDetails ? (
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
							// fullWidth
							id="email"
							label="Email Address"
							name="email"
							autoComplete="email"
							autoFocus
						/>

						<Button
							type="submit"
							// fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2 }}>
							Send Invitation
						</Button>
					</Box>

					<h2>Team Details</h2>
					{console.log(jsonTeamData)}
					{console.log(typeof (jsonTeamData))}
					<TeamDetailTable jsonData={jsonTeamData} />
				</div>
			)}
		</Grid>
	);
};

export default ManageTeam;
