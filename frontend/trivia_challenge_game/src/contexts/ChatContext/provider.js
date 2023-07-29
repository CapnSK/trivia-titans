import { useState, useMemo } from 'react';
import { ChatContext } from './chatcontext';

export const ChatContextProvider = ({ children }) => {
    const [chatContext, chatContextSetter] = useState({
        username: undefined,
        email: undefined,
        teamMates: undefined,
        teamName: undefined,
        teamId: undefined,
    });

    const value = useMemo(() => ({
        username: chatContext.username,
        email: chatContext.email,
        teamMates: chatContext.teamMates,
        teamName: chatContext.teamName,
        teamId: chatContext.teamId,
        setChatContext: (newChatContext) => {
            chatContextSetter(newChatContext);
        }
    }), [chatContext.username, chatContext.email, chatContext.teamMates, chatContext.teamName, chatContext.teamId]);

    return (
        <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
    );
}