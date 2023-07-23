import { useState, useMemo } from 'react';
import { AuthContext } from './authcontext';

export const AuthContextProvider = ({children}) => {
    const [authContext, authContextSetter] = useState({
        username: undefined,
        email: undefined,
        authToken: undefined,
        refreshToken: undefined
    });

    const value = useMemo(() => ({
        username: authContext.username,
        email: authContext.email,
        authToken: authContext.authToken,
        refreshToken: authContext.refreshToken,
        setAuthContext: (newAuthContext) => {
            authContextSetter((prevAuthContext) => {
                console.info("old auth context is ", prevAuthContext);
                console.info("setting auth context as ", newAuthContext);
                //To Do: storing to localstorage part goes here
                return newAuthContext;
            });
        }
    }), [authContext.authToken, authContext.email, authContext.refreshToken, authContext.username]);

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}