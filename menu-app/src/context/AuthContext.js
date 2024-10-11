import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token') || null);

    const refreshTokens = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/auth/refresh/', {
                refresh: localStorage.getItem('refresh_token'), // Retrieve refresh token from local storage
            });
            const newAccessToken = response.data.access; // Assuming the new token is in response.data.access
            setAccessToken(newAccessToken); // Update state with the new access token
            localStorage.setItem('access_token', newAccessToken); // Store new access token in local storage
            return newAccessToken; // Return the new token
        } catch (error) {
            console.error('Error refreshing tokens:', error);
            // Handle token refresh error (e.g., redirect to login)
            return null; // Return null to indicate failure
        }
    };

    const setAuthTokens = (tokens) => {
        if (tokens) {
            setAccessToken(tokens.access); // Assuming tokens contains access token
            localStorage.setItem('access_token', tokens.access);
            if (tokens.refresh) {
                localStorage.setItem('refresh_token', tokens.refresh); // Store refresh token if it exists
            }
        } else {
            // If tokens are null, remove them from state and localStorage
            setAccessToken(null);
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
        }
    };

    const logout = () => {
        setAuthTokens(null); // This will also clear localStorage
        // Optionally redirect to login or perform other logout logic
    };

    return (
        <AuthContext.Provider value={{ accessToken, refreshTokens, logout, setAuthTokens }}>
            {children}
        </AuthContext.Provider>
    );
};

// Create a custom hook for consuming the Auth context
export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthContext;

