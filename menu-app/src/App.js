import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; // Import useAuth to access auth tokens and refresh function
import createAxiosInstance from './axios'; // Import Axios instance creator
import Login from './components/Login';
import LandingPage from './components/LandingPage';
import Register from './components/Register';
import RestaurantDashboard from './components/RestaurantDashboard';
import NotFoundPage from './components/Nunpage';

function App() {
    const { accessToken, refreshTokens } = useAuth(); // Now available in App.js

    // Create the Axios instance with the refreshTokens method
    const axiosInstance = createAxiosInstance(refreshTokens);

    useEffect(() => {
        console.log("Auth Tokens:", accessToken); // For debugging tokens
    }, [accessToken]);

    // Protected route for authenticated users
    const ProtectedRoute = ({ element }) => {
        return accessToken ? element : <Navigate to="/nun" />; // Redirect to NotFoundPage
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login axiosInstance={axiosInstance} />} />
                <Route path="/register" element={<Register />} />
                
                {/* Protect routes that require authentication */}
                <Route path="/restaurant-dashboard/:id" element={<ProtectedRoute element={<RestaurantDashboard axiosInstance={axiosInstance} />} />} />

                {/* Handle 404 and undefined routes */}
                <Route path="/nun" element={<NotFoundPage />} />
                <Route path="*" element={<Navigate to="/nun" />} />
            </Routes>
        </Router>
    );
}

export default App;
