import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import Register from './components/Register';
import CreateRestaurant from './components/CreateRestaurant';
import RestaurantDashboard from './components/RestaurantDashboard';
import RestaurantInfo from './components/RestaurantInfo';
import AddFoodItem from './components/AddFoodItem';
import EditMenu from './components/EditMenu';
import GenerateQRCode from './components/GenerateQRCode';
import DownloadQRCode from './components/DownloadQRCode';
import EditFoodItem from './components/EditFoodItem';
import EditRestaurant from './components/EditRestaurant';
import CreateMenu from './components/CreateMenu.js';
import ViewMenu from './components/ViewMenu.js';

import { RestaurantProvider } from './context/RestaurantContext';


function App() {
    const [authTokens, setAuthTokens] = useState(() => {
        const token = localStorage.getItem('access_token');
        return token ? { access: token, refresh: localStorage.getItem('refresh_token') } : null;
    });

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            setAuthTokens({
                access: token,
                refresh: localStorage.getItem('refresh_token'),
            });
        }
    }, []);

    return (
        <RestaurantProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<Login setAuthTokens={setAuthTokens} />} />
                    <Route path="/register" element={<Register />} />

                    <Route path="/dashboard" element={authTokens ? <Dashboard /> : <Navigate to="/login" />} />
                    <Route path="/create-restaurant" element={authTokens ? <CreateRestaurant /> : <Navigate to="/login" />} />
                    <Route path="/restaurant-dashboard/:id" element={authTokens ? <RestaurantDashboard /> : <Navigate to="/login" />} />

                    <Route path="/restaurant/:id/info" element={authTokens ? <RestaurantInfo /> : <Navigate to="/login" />} />
                    <Route path="/restaurant/:id/add-food" element={authTokens ? <AddFoodItem /> : <Navigate to="/login" />} />
                    <Route path="/restaurant/:id/edit-menu" element={authTokens ? <EditMenu /> : <Navigate to="/login" />} />
                    <Route path="/restaurant/:id/create-menu" element={authTokens ? <CreateMenu /> : <Navigate to="/login" />} />
                    <Route path="/restaurant/:id/generate-qr" element={authTokens ? <GenerateQRCode /> : <Navigate to="/login" />} />
                    <Route path="/restaurant/:id/download-qr" element={authTokens ? <DownloadQRCode /> : <Navigate to="/login" />} />
                    <Route path="/edit-food-item/:foodItemId" element={<EditFoodItem />} />
                    <Route path="/restaurant/:id/edit" element={<EditRestaurant />} />
                    <Route path="/restaurant/:id/view-menu" element={authTokens ? <ViewMenu /> : <Navigate to="/login" />} />

                    {/* Add this route for the public menu view */}
                    <Route path="/menu/menus/:id/public" element={<ViewMenu />} />

                </Routes>
            </Router>
        </RestaurantProvider>
    );
}

export default App;
