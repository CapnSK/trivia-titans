import { useContext, useEffect } from "react";
import { AuthContext } from "../../../contexts";
import { useNavigate } from "react-router-dom";
import { axiosJSON } from "../../../lib/axios";

function Login() {

    const { setAuthContext } = useContext(AuthContext);
    const navigate = useNavigate();
    console.info("Inside Login component");

    //axiosJSON.post("https://run.mocky.io/v3/34cd8ec1-7f99-4cae-b35b-12e73d526b0d").then(console.log).catch(console.log);

    useEffect(() => {
        setTimeout(() => {
            console.info("Waiting for getting auth token data from backend");
            //To Do: Check if local storage has authContext otherwise make network call (before show login form)
            setAuthContext({
                username: "John Doe",
                email: "jdoe@jdoe.com",
                authToken: "sample auth token blah blah",
                refreshToken: "blah2"
            });
            console.info("got auth data now routing to home component");
            navigate("/home", { relative: false });
        }, 5000);
    }, []);

    return (
        <>
            Login Component<br />
        </>
    );
}

export default Login;