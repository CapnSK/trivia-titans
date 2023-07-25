import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../contexts";

function RouteGuard(){
    const { email, username, accessId, tokenId} = useContext(AuthContext);
    // console.log("Routeguard has recieved auth context as ", email, username, accessId, tokenId);
    return (
        <>
            Routeguard Component<br/>
            {username && accessId ? <Outlet/> : <Navigate to={{pathname: "unauth/login"}} relative={false}/>}
        </>
    );
}

export default RouteGuard;