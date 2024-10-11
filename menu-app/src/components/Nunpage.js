// src/components/404Page.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/'); // Redirect to the home page or any other route
    };

    return (
        <div className="d-flex flex-column justify-content-center align-items-center vh-100" style={{ backgroundColor: '#F3F7FA' }}>
            <h1 className="text-danger">404 - Page Not Found</h1>
            <p className="text-muted">The page you are looking for does not exist.</p>
            <button className="btn btn-primary" onClick={handleGoHome}>
                Go to Home
            </button>
        </div>
    );
};

export default NotFoundPage;
