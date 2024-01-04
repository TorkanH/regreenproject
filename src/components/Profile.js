import React from "react";
import { useLocation } from 'react-router-dom';

function Profile() {
    const location = useLocation();
    
    // Ensure that location.state and location.state.id are defined before accessing
    const userId = location.state?.id;

    return (
        <div className="profilepage">
            <h1>Hello {userId}! Welcome to ReGreen Profile</h1>
        </div>
    );
}

export default Profile;
