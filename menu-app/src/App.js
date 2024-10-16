import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/Login';
import LandingPage from './components/LandingPage';
import Register from './components/Register';
import RestaurantDashboard from './components/RestaurantDashboard';
import Nunpage from './components/Nunpage'; // For the 404 page
import RestaurantInfo from './components/RestaurantInfo';
import AddFoodItem from './components/AddFoodItem';
import EditMenu from './components/EditMenu';
import GenerateQRCode from './components/GenerateQRCode';
import DownloadQRCode from './components/DownloadQRCode';
import EditFoodItem from './components/EditFoodItem';
import EditRestaurant from './components/EditRestaurant';
import CreateMenu from './components/CreateMenu';
import ViewMenu from './components/ViewMenu';
import CreateRestaurant from './components/CreateRestaurant';
import OfficialMenu from './components/OfficialMenu';

import { useAuth } from './provider/authProvider'; // To manage authentication state
import ProtectedRoute from './components/ProtectedRoute'; // Import the ProtectedRoute component
import { RestaurantProvider } from './context/RestaurantContext'; // Adjust the path as needed

function App() {
    const { token } = useAuth();

    useEffect(() => {
        console.log("Auth Token:", token);
    }, [token]);

    return (
        <RestaurantProvider>
            <Router>
                <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected routes for authenticated users */}
                    <Route element={<ProtectedRoute />}>
                        {/* Restaurant dashboard with dynamic ID */}
                        <Route path="/restaurant-dashboard/:id" element={<RestaurantDashboard />} />
                        <Route path="/create-restaurant" element={<CreateRestaurant />} />
                        <Route path="/restaurant/:id/info" element={<RestaurantInfo />} />
                        <Route path="/restaurant/:id/add-food" element={<AddFoodItem />} />
                        <Route path="/restaurant/:id/edit-menu" element={<EditMenu />} />
                        <Route path="/restaurant/:id/create-menu" element={<CreateMenu />} />
                        <Route path="/restaurant/:id/generate-qr" element={<GenerateQRCode />} />
                        <Route path="/restaurant/:id/download-qr" element={<DownloadQRCode />} />
                        <Route path="/edit-food-item/:foodItemId" element={<EditFoodItem />} />
                        <Route path="/restaurant/:id/edit" element={<EditRestaurant />} />
                        <Route path="/restaurant/:id/view-menu" element={<ViewMenu />} />
                   
                        
                    </Route>

                    {/* Public menu view */}
                    <Route path="/menu/menus/:id/public" element={<OfficialMenu />} />

                    {/* 404 Not found page */}
                    <Route path="/nun" element={<Nunpage />} />
                    <Route path="*" element={<Navigate to="/nun" />} />
                </Routes>
            </Router>
        </RestaurantProvider>
    );
}

export default App;
