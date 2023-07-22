import { createContext } from "react";

export const AuthContext = createContext({
    username: undefined,
    email: undefined,
    authToken: undefined,
    refreshToken: undefined,
    setAuthContext: () => {
        throw new Error("setAuthContext function must have a consumer implementation")
    }
});