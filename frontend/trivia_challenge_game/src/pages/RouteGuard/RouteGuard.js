import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { localStorageUtil } from "../../util";
import { AuthContext } from '../../contexts/AuthContext/authcontext';
import React from "react";
import { useEffect } from "react";

function RouteGuard(){
    const { setAuthContext } = React.useContext(AuthContext);
    const navigate = useNavigate();
    // const { email, username, accessId, tokenId} = useContext(AuthContext);
    if (localStorageUtil.getItem('user') === null) {
        navigate("unauth/login",{relative: false});
    }
    // if (localStorageUtil.getItem('role') === 'admin') {
    //     return <Navigate to={{pathname: "admin/home"}} relative={false}/>
    // }
    // else if (localStorageUtil.getItem('role') === 'player') {
    //     return <Navigate to={{pathname: "/home"}} relative={false}/>
    // }
    let username, email, accessId, tokenId, role;

    if(localStorageUtil.getItem('user') && localStorageUtil.getItem('user')['username']){
        username = localStorageUtil.getItem('user')['username'];
        email = localStorageUtil.getItem('user')['email'];
        accessId = localStorageUtil.getItem('user')['accessId'];
        tokenId = localStorageUtil.getItem('user')['tokenId'];
        role = localStorageUtil.getItem('user')['role'];
    }

    useEffect(() => {
        setAuthContext({username: username, email: email, accessId: accessId, tokenId: tokenId, role:role});
        // console.log("Routeguard has recieved auth context as ", email, username, accessId, tokenId);
    }, [username, email, accessId, tokenId, role]);
    // console.log("Routeguard has recieved auth context as ", email, username, accessId, tokenId);
    
    return (
        <>
            {username && accessId ? <Outlet/> : <Navigate to={{pathname: "unauth/login"}} relative={false}/>}
        </>
    );
}

export default RouteGuard;