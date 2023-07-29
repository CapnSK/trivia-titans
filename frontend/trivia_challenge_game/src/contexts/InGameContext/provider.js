import { useState, useMemo } from 'react';
import { InGameContext } from './ingamecontext';

export const InGameContextProvider = ({ children }) => {
    const [inGameContext, inGameContextSetter] = useState({
        teamId: undefined,
        leader: undefined,
        members: undefined,
        triviaId: undefined,
        matchInstanceId: undefined,
        _syncChannel: undefined,
    });

    const value = useMemo(() => ({
        teamId: inGameContext.teamId,
        leader: inGameContext.leader,
        members: inGameContext.members,
        triviaId: inGameContext.triviaId,
        matchInstanceId: inGameContext.matchInstanceId,
        _syncChannel: inGameContext._syncChannel,
        setInGameContext: (newInGameContext) => {
            inGameContextSetter(oldInGameContext => {
                if (oldInGameContext._syncChannel?.close) {
                    oldInGameContext._syncChannel.close();
                }
            });
            newInGameContext._syncChannel = openChannel(newInGameContext);
            return newInGameContext;
        }
    }), [inGameContext.teamId, inGameContext.leader, inGameContext.members, inGameContext.triviaId, inGameContext.matchInstanceId, inGameContext._syncChannel]);

    return (
        <InGameContext.Provider value={value}>{children}</InGameContext.Provider>
    );
}

const openChannel = () => {
    // code to create and observable and return it will go here
}