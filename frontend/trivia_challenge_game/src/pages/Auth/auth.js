import "./auth.css";

function Auth(props) {
    //all the authentiation logic will go here, right now default user context being set
    props.userContextSetter({
        name: "John Doe",
        token: "<actual-token>",
        id: "<unique-id across platform>"
    });
}

export default Auth;