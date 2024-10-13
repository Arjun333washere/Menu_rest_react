import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../provider/authProvider'; // Import the AuthProvider
import axios from 'axios'; // Import axios if not using an instance

function Login() { 
    const [mobileNumber, setMobileNumber] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null); // For displaying error messages
    const navigate = useNavigate();
    const { setToken } = useAuth(); // Use setToken from AuthProvider

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null); // Reset any previous error
        try {
            const response = await axios.post('http://127.0.0.1:8000/auth/api/login/', {
                mobile_number: mobileNumber,
                password: password,
            });
    
            console.log("Login successful:", response.data);
    
            const { access, refresh, has_restaurant, restaurant_id } = response.data;
    
            // Store the access token using setToken from the context
            setToken(access);  // Set only the access token to the context
    
            // Store refresh token in localStorage
            localStorage.setItem('refreshToken', refresh);
            localStorage.setItem('token', access); // Ensure the access token is also stored
    
            // Redirect based on restaurant ownership
            if (has_restaurant) {
                console.log(`Navigating to /restaurant-dashboard/${restaurant_id}`);
                navigate(`/restaurant-dashboard/${restaurant_id}`);
            } else {
                console.log("User does not own a restaurant");
                navigate("/dashboard");
            }
    
        } catch (error) {
            console.error("Login failed", error);
            setError("Login failed. Please check your mobile number or password.");
        }
    };
    

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <label>
                    Mobile Number:
                    <input
                        type="text"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        required
                    />
                </label>
                <br />
                <label>
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                <br />
                <button type="submit">Login</button>
                {error && <p style={{ color: 'red' }}>{error}</p>} {/* Show error if exists */}
            </form>
        </div>
    );
}

export default Login;
