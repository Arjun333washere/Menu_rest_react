import React from 'react';
import '../LandingPage.css'; // Import landing page styles


const LandingPage = () => {
    return (
        <div className="container landing-container">
            <header className="landing-header">
                <h1 className="text-dark">WELCOME TO THE MENU APP</h1>
                <p className="text-gray">Your one-stop solution for restaurant menus.</p>
                <div className="d-flex justify-content-center">
                    <a href="/login" className="btn mx-2">Login</a>
                    <a href="/register" className="btn mx-2">Sign Up</a>
                </div>
            </header>
            <section className="landing-features">
                <h2 className="text-dark">Features</h2>
                <ul className="list-unstyled">
                    <li className="text-gray">Browse Menus from Local Restaurants</li>
                    <li className="text-gray">Easy QR Code Access</li>
                    <li className="text-gray">Manage Your Favorite Dishes</li>
                    <li className="text-gray">Quick and Secure Login</li>
                </ul>
            </section>
            <footer className="landing-footer">
                <p className="text-gray">&copy; 2024 Menu App. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
