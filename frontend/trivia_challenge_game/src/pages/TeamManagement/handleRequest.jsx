import { useParams } from "react-router-dom";

const HandleRequest = () => {
	const { teamId } = useParams();
	console.log(teamId);
	return (
		<div>
			{/* <Button onClick={handleAccept}>Accept</Button>
			<Button onClick={handleDeny}>Deny</Button> */}
		</div>
	);
};

export default HandleRequest;
