import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import the AuthContext

function Login({ axiosInstance }) { // Receive axiosInstance as a prop
    const [mobileNumber, setMobileNumber] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { setAuthTokens } = useAuth(); // Get setAuthTokens from AuthContext

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/auth/api/login/', {
                mobile_number: mobileNumber,
                password: password,
            });

            console.log("Login successful:", response.data);

            const { access, refresh, has_restaurant, restaurant_id } = response.data;

            // Store the tokens in AuthContext
            setAuthTokens({ access, refresh });

            if (has_restaurant) {
                console.log("Navigating to restaurant dashboard", restaurant_id);
                navigate(`/restaurant-dashboard/${restaurant_id}`);
            } else {
                console.log("User does not own a restaurant");
                // Navigate to another page or show an error
            }
        } catch (error) {
            console.error("Login failed", error);
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
                    />
                </label>
                <br />
                <label>
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
                <br />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
