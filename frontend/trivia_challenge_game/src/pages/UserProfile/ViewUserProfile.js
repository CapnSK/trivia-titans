import {useNavigate} from 'react-router-dom';

function ViewUserProfile(){
    const navigate = useNavigate();
    return (
        <div>
            <div className="auth-inner" >
                <div>
                    <button onClick={() => {navigate("/compareStat")}}>
                        Compare Teams
                    </button>
                </div>
            </div>
            <div className="auth-inner" >
                <div>
                    <button onClick={() => {navigate("/userStat")}}>
                        Status User
                    </button>
                </div>
            </div>
            <div className="auth-inner" >
                <div>
                    <button onClick={() => {navigate("/editPersonalProfile")}}>
                        Edit Personal Profile
                    </button>
                </div>
            </div>
            <div className="auth-inner" >
                <div>
                    <button onClick={() => {navigate("/affiliations")}}>
                       Manage User affiliations with team
                    </button>
                </div>
            </div>
        </div>
        
    );
}

export default ViewUserProfile;