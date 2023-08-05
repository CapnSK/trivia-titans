import { createContext } from "react";

export const InGameContext = createContext({
    matchInstanceData: undefined,
    teamData: undefined,
    triviaData: undefined,
    questionsData: undefined,
    setInGameContext: () => {
        throw new Error("setInGameContext function must have a consumer implementation")
    }
});