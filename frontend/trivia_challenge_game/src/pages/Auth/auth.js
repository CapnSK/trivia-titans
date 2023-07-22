import "./auth.css";
import { BrowserRouter as Router, Routes, Route, Link, Outlet } from 'react-router-dom'

function Auth(props) {
    //all the authentiation logic will go here, right now default user context being set
    // props.userContextSetter({
    //     name: "John Doe",
    //     token: "<actual-token>",
    //     id: "<unique-id across platform>"
    // });
    console.info("Inside Auth component");
    return (
        <>

            Auth
            <Outlet />
            {/* <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/confirm-email" element={<ConfirmEmail />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} /> */}

        </>
    );
}

export default Auth;