import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../contexts";

function RouteGuard(){
    console.info("Inside Routeguard component");
    const { email, username, authToken, refreshToken } = useContext(AuthContext);
    console.log("Routeguard has recieved auth context as ", email, username, authToken, refreshToken);
    return (
        <>
            Routeguard Component<br/>
            {username && authToken ? <Outlet/> : <Navigate to={{pathname: "unauth/login"}} relative={false}/>}
        </>
    );
}

export default RouteGuard;