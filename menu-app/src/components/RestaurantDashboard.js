import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useRestaurant } from '../context/RestaurantContext';

const RestaurantDashboard = () => {
    const { id } = useParams(); // Restaurant ID from URL
    const [restaurant, setRestaurant] = useState(null); // Restaurant data
    const [menuId, setMenuId] = useState(null); // Menu ID
    const [hasQRCode, setHasQRCode] = useState(false); // Track if QR code is available
    const [error, setError] = useState(''); // Error messages
    const [successMessage, setSuccessMessage] = useState(''); // Success messages

    const navigate = useNavigate();
    const { setRestaurantId } = useRestaurant(); // Update restaurant ID in context

    // Fetch restaurant and menu data
    useEffect(() => {
        const fetchRestaurantAndMenu = async () => {
            const access_token = localStorage.getItem('access_token');
            try {
                // Fetch Restaurant Data
                const restaurantResponse = await axios.get(`http://127.0.0.1:8000/menu/restaurants/${id}/`, {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                });
                setRestaurant(restaurantResponse.data);
                setRestaurantId(id); // Set restaurant ID in context

                // Fetch Menu Data
                const menuResponse = await axios.get(`http://127.0.0.1:8000/menu/menus/?restaurant=${id}`, {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                });

                if (menuResponse.data && menuResponse.data.length > 0) {
                    const correctMenu = menuResponse.data.find(menu => menu.restaurant === parseInt(id));
                    if (correctMenu) {
                        setMenuId(correctMenu.id);
                        setHasQRCode(correctMenu.qr_code !== null); // Check for QR code
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load restaurant or menu details.');
            }
        };

        fetchRestaurantAndMenu();
    }, [id, setRestaurantId]);

    // Handle delete restaurant
    const handleDelete = async () => {
        const access_token = localStorage.getItem('access_token');
        try {
            await axios.delete(`http://127.0.0.1:8000/menu/restaurants/${id}/`, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            });
            setSuccessMessage('Restaurant deleted successfully.');
            navigate('/');
        } catch (error) {
            console.error('Error deleting restaurant:', error);
            setError('Failed to delete restaurant.');
        }
    };

    // Generate QR code for the menu
    const handleGenerateQRCode = async () => {
        if (!menuId) {
            setError('No menu available to generate QR code.');
            return;
        }

        const access_token = localStorage.getItem('access_token');
        try {
            await axios.post(`http://127.0.0.1:8000/menu/menus/${menuId}/generate-qr-code/`, {}, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            });
            setSuccessMessage('QR code generated successfully.');
            setHasQRCode(true); // Update state after generating QR code
        } catch (error) {
            console.error('Error generating QR code:', error);
            setError('Failed to generate QR code.');
        }
    };

    // Download the generated QR code
    const handleDownloadQRCode = async () => {
        if (!menuId) {
            setError('No menu available to download QR code.');
            return;
        }

        const access_token = localStorage.getItem('access_token');
        try {
            const response = await axios.get(`http://127.0.0.1:8000/menu/menus/${menuId}/download-qr-code/`, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const a = document.createElement('a');
            a.href = url;
            a.download = `qr_code_${menuId}.png`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            console.error('Error downloading QR code:', error);
            setError('Failed to download QR code.');
        }
    };

    return (
        <div>
            {error && <div className="alert alert-danger">{error}</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}

            {!restaurant ? (
                <p>Loading...</p>
            ) : (
                <>
                    <h2>{restaurant.name}</h2>
                    <p>{restaurant.description}</p>

                    <button onClick={() => navigate(`/restaurant/${id}/info`)}>View Restaurant Info</button>
                    <button onClick={() => navigate(`/restaurant/${id}/add-food`)}>Edit Food Item</button>

                    {!restaurant.has_menu && (
                        <button onClick={() => navigate(`/restaurant/${id}/create-menu`)}>Create Menu</button>
                    )}

                    {menuId ? (
                        <>
                            <button onClick={() => navigate(`/restaurant/${menuId}/view-menu`)}>View Customer Menu</button>
                            {!hasQRCode && <button onClick={handleGenerateQRCode}>Generate QR Code</button>}
                            {hasQRCode && <button onClick={handleDownloadQRCode}>Download QR Code</button>}
                        </>
                    ) : (
                        <p>No menu available for this restaurant. Please create one.</p>
                    )}

                    <button onClick={handleDelete}>Delete Restaurant</button>
                </>
            )}
        </div>
    );
};

export default RestaurantDashboard;
