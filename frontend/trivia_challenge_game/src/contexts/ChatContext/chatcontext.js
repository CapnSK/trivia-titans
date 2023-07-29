import { createContext } from "react";

export const ChatContext = createContext({
    username: undefined,
    email: undefined,
    teamMates: undefined,
    teamName: undefined,
    teamId: undefined,
    setChatContext: () => {
        throw new Error("setChatContext function must have a consumer implementation")
    }
});