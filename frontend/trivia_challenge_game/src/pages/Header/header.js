import { AuthContext } from "../../contexts";
import "./header.css";
import { useContext } from "react";

function Header() {
    const { username, setAuthContext } = useContext(AuthContext);
    return (
        <>
            Header Component<br/>
            {username ? "User logged in" : "user logged out"}
            {/* <button accessKey=""/> */}
        </>
    );
}

export default Header;