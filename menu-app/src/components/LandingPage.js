// LandingPage.js
import React from 'react';
import '../LandingPage.css'; // Optional for custom styles

const LandingPage = () => {
    return (
        <div className="landing-container">
            <header className="landing-header">
                <h1>Welcome to Our Menu App</h1>
                <p>Your one-stop solution for restaurant menus.</p>
                <a href="/login" className="btn btn-primary">Login</a>
                <a href="/register" className="btn btn-secondary">Sign Up</a>
            </header>
            <section className="landing-features">
                <h2>Features</h2>
                <ul>
                    <li>Browse Menus from Local Restaurants</li>
                    <li>Easy QR Code Access</li>
                    <li>Manage Your Favorite Dishes</li>
                    <li>Quick and Secure Login</li>
                </ul>
            </section>
            <footer className="landing-footer">
                <p>&copy; 2024 Menu App. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LandingPage;

