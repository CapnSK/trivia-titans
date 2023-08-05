import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import axios from "axios";
import {axiosJSON} from "../../lib/axios";
import { Box, TextField, Grid, Paper, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import { useParams } from 'react-router-dom';

import TeamDetailTable from './teamDetailTable';
import { ChatContext } from "../../contexts";
import { introduce } from "../../util";

function ManageTeam() {
	const [teamNames, setTeamNames] = useState([]);
	const [selectedTeamName, setSelectedTeamName] = useState('');

	const [teamStatistics, setTeamStatistics] = useState([]);

	const navigate = useNavigate();

	const user = localStorage.getItem("user");
	const adminUserName = JSON.parse(user).username;
	const adminEmail = JSON.parse(user).email;

	const [invitedEmails, setInvitedEmails] = useState([]);
	const [jsonTeamData, setJsonTeamData] = useState({});
	const [loadingTeams, setLoadingTeams] = useState(true);
	const [loadingTeamDetails, setLoadingTeamDetails] = useState(true);
	const [loadingTeamStatistic, setLoadingTeamStatistic] = useState(true);
	const [loadingTeamStatisticMessgae, setLoadingTeamStatisticMessgae] = useState("Loading Team Statisctic ... ");

	let { setChatContext  } = useContext(ChatContext);

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
					setChatContext({
						email: jsonResData['admin']['email'],
						username: jsonResData['admin']['username'],
						teamId: jsonResData['id'],
						teamName: jsonResData['team_name'] 
					})

					introduce({username: jsonResData['admin']['username'], teamId: jsonResData['id']})

					setJsonTeamData(jsonResData)
					setLoadingTeamDetails(false);

					getTeamStatistic(jsonResData)
				}
				)
		}
		else {
			setLoadingTeamDetails(true);
			// setLoadingTeams(true);
			setLoadingTeamStatistic(true);
		}
	}

	const sendInvitation = (username, email) => {
		const data_json = {
			// id: props['state']['data'],
			team_name: selectedTeamName,
			userName: username,
			email: email,
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
				else if (res['data'] == "You are admin") {
					alert(`${username} is the admin of the team.`)
				}
				getTeamDetail(selectedTeamName);
			});
	}

	const handleSubmitForm = async (event) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		
		const username = formData.get("username");

		// const data_json = {username: data.get("username")};
		// // const data_json = {username: data.get("username")};
		// console.log(data_json)
		// console.log(`${process.env.REACT_APP_USER_AUTH_REG_LAMBDA_API_GATEWAY_ABHINAV}/checkIfUserExists`)
		// axios({
		// 	// Endpoint to send files
		// 	url: `${process.env.REACT_APP_USER_AUTH_REG_LAMBDA_API_GATEWAY_ABHINAV}/checkIfUserExists`,
		// 	method: "POST",
		// 	data: data_json,
		// })
		// 	// Handle the response from backend here
		// 	.then((res) => {
		// 		console.log(res)
		// 		if(res['data']['status'] === true) {
		// 			sendInvitation(data.get("username"), res['data']['body'])
		// 		}
		// 		else {
		// 			alert("User not exist in the system")
		// 		}
		// 	})

		// console.log(process.env.REACT_APP_USER_AUTH_REG_LAMBDA_API_GATEWAY_ABHINAV + '/checkIfUserExists');

		// const response = await axiosJSON.post(process.env.REACT_APP_USER_AUTH_REG_LAMBDA_API_GATEWAY_ABHINAV + '/checkIfUserExists', 
		// 										JSON.stringify({ "username":username }))

		// const data = await response.data

		// console.log(data)


		try {
			let response = await axios.post( process.env.REACT_APP_USER_AUTH_REG_LAMBDA_API_GATEWAY_ABHINAV + '/checkifuserexists', 
											JSON.stringify({username:username }));
			console.log(response);
			if (response.data.status == true) {
				sendInvitation(username, response['data']['body'])
			}
			else {
				alert (`${username} not exist in the system`)
			}
		  } catch (error) {
			alert (`${username} not exist in the system`)     // NOTE - use "error.response.data` (not "error")
		  }
		
	};

	// Function to handle adding a new email address to the invitedEmails state
	const handleAddEmail = (e) => {

	};

	const getTeamStatistic = (jsonResData) => {

		console.log(jsonResData)
		axios({
			// Endpoint to send files
			url: `https://mimooazyk3.execute-api.us-east-1.amazonaws.com/first/getuserprofile`,
			method: "POST",
			data: { team_id: [jsonResData['id']] },
			// data: { team_id: ["1"] },
		})
			// Handle the response from backend here
			.then((res) => {
				console.log(res['data'])
				console.log(res['data'].length)
				console.log(typeof(res['data'].length))
				if (res['data'].length == 0) {
					setLoadingTeamStatisticMessgae("No matchs played");
					setLoadingTeamStatistic(true);
				}
				else {		
					setTeamStatistics(res['data']);
					setLoadingTeamStatistic(false);
				}
				
			})
	}

	const handleDropdownChange = (event) => {
		console.log(event.target.value);

		setSelectedTeamName(event.target.value);
		console.log(selectedTeamName);
		getTeamDetail(event.target.value);
	};

	useEffect(() => {
		// Fetch team names from the Lambda function

		setLoadingTeamDetails(true);
		setLoadingTeamStatistic(true);
		setLoadingTeamStatisticMessgae("Loading Team Statisctic ... ");

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
				setLoadingTeams(false);
			})
		
	}, []);


	// useLayoutEffect(() => {
	// 	//check local token or something
	// 	console.log('useLayoutEffect is called.');
	// 	getTeamDetail();
	// }, [teamId]);

	return (
		<Grid item style={{ "alignItems":"center", "display":"flex", "flexDirection":"column"}} xs={12} sm={8} md={4} component={Paper} elevation={6} >
			<Button variant="contained" onClick={() => { navigate("/createTeam") }}>
				Create new Team
			</Button>
			<br></br>
			{loadingTeams ? (
				<p>Loading Teams ... {console.log("in loading")}</p>
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
			<br></br>
			<h3>Team Details</h3>
			{loadingTeamDetails ? (
				<p>Loading Team Details ... {console.log("in loading")}</p>
			) : (
				<div>
					{console.log("in else")}
					<Box style={{ "display":"flex", "flex-direction":"column"}} 
						component="form"
						// noValidate
						onSubmit={handleSubmitForm}
						sx={{ mt: 1 }}>
						<TextField
							margin="normal"
							required
							// fullWidth
							id="username"
							label="User Name"
							name="username"
							autoComplete="username"
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

					
					{console.log(jsonTeamData)}
					{console.log(typeof (jsonTeamData))}
					<TeamDetailTable jsonData={jsonTeamData} />
				</div>
			)}
			<br></br>

			<h3>Team Statistics</h3>
			{loadingTeamStatistic ? (
				<p>{loadingTeamStatisticMessgae}</p>
			) : (
				<div>
					<table  style={{ border: '1px solid black', margin: '10px 0' }}>
						<thead>
							<tr>
								<th style={{ border: 'solid 1px gray' , padding: '5px' }}>Team Name</th>
								<th style={{ border: 'solid 1px gray' , padding: '5px' }}>Match Status</th>
								<th style={{ border: 'solid 1px gray' , padding: '5px' }}>Result</th>
								<th style={{ border: 'solid 1px gray' , padding: '5px' }}>Score</th>
								<th style={{ border: 'solid 1px gray' , padding: '5px' }}>Game Detail</th>
							</tr>
						</thead>
						<tbody>
							{teamStatistics.map((team) => (
								<tr key={team.match_instance_id}>
									<td style={{ border: 'solid 1px gray' , padding: '5px' }}>{team.team_name}</td>
									<td style={{ border: 'solid 1px gray' , padding: '5px' }}>{team.match_status}</td>
									<td style={{ border: 'solid 1px gray' , padding: '5px' }}>{team.win === "true" ? "Win": "Loss"}</td>
									<td style={{ border: 'solid 1px gray' , padding: '5px' }}>{team.score}</td>
									<td style={{ border: 'solid 1px gray' , padding: '5px' }}>
										Trivia Name: {team.match_config.trivia_name}<br />
										Category: {team.match_config.category}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</Grid>
	);
};

export default ManageTeam;
