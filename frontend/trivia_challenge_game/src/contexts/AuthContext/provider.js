import { useState, useMemo } from 'react';
import { AuthContext } from './authcontext';
import { localStorageUtil } from '../../util';

export const AuthContextProvider = ({children}) => {
    const [authContext, authContextSetter] = useState({
        username: undefined,
        email: undefined,
        accessId: undefined,
        tokenId: undefined
    });

    const value = useMemo(() => ({
        username: authContext.username,
        email: authContext.email,
        accessId: authContext.accessId,
        tokenId: authContext.tokenId,
        setAuthContext: (newAuthContext) => {
            authContextSetter((prevAuthContext) => {
                //To Do: storing to localstorage part goes here
                localStorageUtil.setItem('user', newAuthContext);
                return newAuthContext;
            });
        }
    }), [authContext.accessId, authContext.email, authContext.tokenId, authContext.username]);

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}