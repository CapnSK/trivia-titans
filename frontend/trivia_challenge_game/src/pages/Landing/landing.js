import {useNavigate} from 'react-router-dom';

function Landing(){
    const navigate = useNavigate();
    return (
        <div>
            <div className="auth-inner" >
                <div>
                    <button onClick={() => {navigate("/manageTeam")}}>
                        Manage your Teams!
                    </button>
                </div>
            </div>
            <div className="auth-inner" >
                <div>
                    <button onClick={() => {navigate("/leaderboard")}}>
                        Join a game!
                    </button>
                </div>
            </div>
            <div className="auth-inner" >
                <div>
                    <button onClick={() => {navigate("/leaderboard")}}>
                        View Leaderboards!
                    </button>
                </div>
            </div>
        </div>
        
    );
}

export default Landing;