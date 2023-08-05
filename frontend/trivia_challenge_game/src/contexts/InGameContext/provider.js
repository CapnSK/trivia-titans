import { useState, useMemo } from 'react';
import { InGameContext } from './ingamecontext';

export const InGameContextProvider = ({ children }) => {
    const [inGameContext, inGameContextSetter] = useState({
        matchInstanceData: undefined,
        teamData: undefined,
        triviaData: undefined,
        questionsData: undefined
    });

    const value = useMemo(() => ({
        matchInstanceData: inGameContext.matchInstanceData,
        teamData: inGameContext.teamData,
        triviaData: inGameContext.triviaData,
        questionsData: inGameContext.questionsData,
        setInGameContext: (newInGameContext) => {
            console.log("new in game context from provider is", newInGameContext);
            inGameContextSetter((oldIngameContext)=>{
                console.log("old in game context from provider is", oldIngameContext);
                return newInGameContext;
            });
        }
    }), [inGameContext.matchInstanceData, inGameContext.teamData, inGameContext.triviaData, inGameContext.questionsData]);

    return (
        <InGameContext.Provider value={value}>{children}</InGameContext.Provider>
    );
}