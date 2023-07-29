import { Navigate, Outlet } from "react-router-dom";
import { localStorageUtil } from "../../util";

function RouteGuard(){
    // const { email, username, accessId, tokenId} = useContext(AuthContext);
    if (localStorageUtil.getItem('user') === null) {
        return <Navigate to={{pathname: "unauth/login"}} relative={false}/>
    }
    const username = localStorageUtil.getItem('user')['username'];
    const accessId = localStorageUtil.getItem('user')['accessId'];
    // console.log("Routeguard has recieved auth context as ", email, username, accessId, tokenId);
    return (
        <>
            {username && accessId ? <Outlet/> : <Navigate to={{pathname: "unauth/login"}} relative={false}/>}
        </>
    );
}

export default RouteGuard;