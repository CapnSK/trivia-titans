import { Typography } from "@mui/material";
import "./textbubble.css";

export const TextBubble = ({sender, recipient, message}) => {
    return (
        <>
            <div className={`bubble ${sender === recipient ? "self" : ""}`}>
                <div className="header">
                    {sender && recipient && sender !== recipient ? 
                        (
                            <>
                                <Typography variant="caption">
                                    {sender}
                                </Typography>
                                <Typography variant="caption">
                                    {recipient === "public" ? "All" : recipient}
                                </Typography>
                            </>
                        ) : 
                        (
                            <>
                                <Typography variant="caption">
                                    You
                                </Typography>
                            </>
                        )}
                </div>
                <div className="body">
                    <Typography variant="body1">
                        {message}
                    </Typography>
                </div>
            </div>
        </>
    );
}