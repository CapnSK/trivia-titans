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
                        View Leaderboards!
                    </button>
                </div>
            </div>
            <div className="auth-inner" >
                <div>
                    <button onClick={() => {navigate("/userProfile")}}>
                        User Profile Management
                    </button>
                </div>
            </div>
            <div className="auth-inner" >
                <div>
                    <button onClick={() => {navigate("/joinGame")}}>
                       Join Game
                    </button>
                </div>
            </div>
        </div>
        
    );
}

export default Landing;