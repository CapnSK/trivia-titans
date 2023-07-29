import { createContext } from "react";

export const InGameContext = createContext({
    teamId: undefined,
    leader: undefined,
    members: undefined,
    triviaId: undefined,
    matchInstanceId: undefined,
    _syncChannel: undefined,
    setInGameContext: () => {
        throw new Error("setInGameContext function must have a consumer implementation")
    }
});