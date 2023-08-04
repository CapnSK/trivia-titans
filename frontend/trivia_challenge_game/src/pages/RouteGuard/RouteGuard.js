import { Navigate, Outlet } from "react-router-dom";
import { localStorageUtil } from "../../util";
import { AuthContext } from '../../contexts/AuthContext/authcontext';
import React from "react";
import { useEffect } from "react";

function RouteGuard(){
    const { setAuthContext } = React.useContext(AuthContext);

    useEffect(() => {
        setAuthContext({username: username, email: email, accessId: accessId, tokenId: tokenId, role:role});
        // console.log("Routeguard has recieved auth context as ", email, username, accessId, tokenId);
    }, [username, email, accessId, tokenId, role]);
    // console.log("Routeguard has recieved auth context as ", email, username, accessId, tokenId);
    // const { email, username, accessId, tokenId} = useContext(AuthContext);
    if (localStorageUtil.getItem('user') === null) {
        return <Navigate to={{pathname: "unauth/login"}} relative={false}/>
    }
    // if (localStorageUtil.getItem('role') === 'admin') {
    //     return <Navigate to={{pathname: "admin/home"}} relative={false}/>
    // }
    // else if (localStorageUtil.getItem('role') === 'player') {
    //     return <Navigate to={{pathname: "/home"}} relative={false}/>
    // }
    const username = localStorageUtil.getItem('user')['username'];
    const email = localStorageUtil.getItem('user')['email'];
    const accessId = localStorageUtil.getItem('user')['accessId'];
    const tokenId = localStorageUtil.getItem('user')['tokenId'];
    const role = localStorageUtil.getItem('user')['role'];
    
    return (
        <>
            {username && accessId ? <Outlet/> : <Navigate to={{pathname: "unauth/login"}} relative={false}/>}
        </>
    );
}

export default RouteGuard;