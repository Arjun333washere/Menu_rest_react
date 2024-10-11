import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRestaurant } from '../context/RestaurantContext';
import { useAuth } from '../context/AuthContext';
import { FaUtensils, FaInfoCircle, FaEdit, FaFileAlt, FaQrcode } from 'react-icons/fa';
import '../css/Dashboard.css';

const RestaurantDashboard = ({ axiosInstance }) => {
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [menuId, setMenuId] = useState(null);
    const [hasQRCode, setHasQRCode] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const navigate = useNavigate();
    const { setRestaurantId, isAuthenticated } = useRestaurant(); // Added isAuthenticated from context
    const { refreshTokens } = useAuth();

    useEffect(() => {
        const fetchRestaurantAndMenu = async () => {
            if (!isAuthenticated) {
                navigate('/login'); // Redirect to login if not authenticated
                return;
            }
            
            try {
                console.log('Fetching restaurant and menu data...');
                await refreshTokens();

                // Fetch restaurant details
                const restaurantResponse = await axiosInstance.get(`/menu/restaurants/${id}/`);
                console.log('Restaurant data:', restaurantResponse.data);
                setRestaurant(restaurantResponse.data);
                setRestaurantId(id);

                // Fetch menu details
                const menuResponse = await axiosInstance.get(`/menu/menus/?restaurant=${id}`);
                console.log('Menu data:', menuResponse.data);

                if (menuResponse.data && menuResponse.data.length > 0) {
                    const correctMenu = menuResponse.data.find(menu => menu.restaurant === parseInt(id));
                    if (correctMenu) {
                        setMenuId(correctMenu.id);
                        setHasQRCode(correctMenu.qr_code !== null);
                        console.log('Menu ID set:', correctMenu.id);
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load restaurant or menu details.');
            }
        };

        fetchRestaurantAndMenu();
    }, [id, setRestaurantId, refreshTokens, axiosInstance, isAuthenticated, navigate]);

    const handleGenerateQRCode = async () => {
        if (!menuId) {
            setError('No menu available to generate QR code.');
            return;
        }

        try {
            await refreshTokens();
            await axiosInstance.post(`/menu/menus/${menuId}/generate-qr-code/`);
            setSuccessMessage('QR code generated successfully.');
            setHasQRCode(true);
        } catch (error) {
            console.error('Error generating QR code:', error);
            setError('Failed to generate QR code.');
        }
    };

    const handleDownloadQRCode = async () => {
        if (!menuId) {
            setError('No menu available to download QR code.');
            return;
        }

        try {
            await refreshTokens();
            const response = await axiosInstance.get(`/menu/menus/${menuId}/download-qr-code/`, {
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
        <div className="dashboard-container" style={{ backgroundColor: '#F3F7FA', padding: '20px' }}>
            <div className="container py-4">
                <div className="row">
                    <div className="col-12">
                        <div className="card dashboard-card shadow-lg">
                            {error && <div className="alert alert-danger">{error}</div>}
                            {successMessage && <div className="alert alert-success">{successMessage}</div>}

                            {!restaurant ? (
                                <p className="text-center">Loading...</p>
                            ) : (
                                <>
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <h2 className="text-dark">Hey {restaurant.name}!</h2>
                                        <button
                                            className="btn btn-outline-secondary"
                                            onClick={() => {
                                                if (restaurant.id) {
                                                    console.log('Navigating to restaurant info page...');
                                                    navigate(`/restaurant/${restaurant.id}/info`);
                                                } else {
                                                    console.log('Restaurant ID not available for navigation');
                                                }
                                            }}
                                        >
                                            <FaInfoCircle className="me-2" /> View Restaurant info
                                        </button>
                                    </div>

                                    <p className="text-muted mb-4">{restaurant.description}</p>

                                    <div className="row g-3">
                                        <div className="col-md-6 col-lg-3">
                                            <div className="card action-card shadow-sm h-100">
                                                <div className="card-body d-flex flex-column justify-content-between">
                                                    <FaEdit className="action-icon mb-3" />
                                                    <h5>Edit Food Items</h5>
                                                    <button
                                                        className="btn btn-primary w-100"
                                                        onClick={() => {
                                                            if (restaurant.id) {
                                                                console.log('Navigating to add food page...');
                                                                navigate(`/restaurant/${restaurant.id}/add-food`);
                                                            } else {
                                                                console.log('Restaurant ID not available for navigation');
                                                            }
                                                        }}
                                                    >
                                                        <FaUtensils className="me-2" /> Edit Food
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {!restaurant.has_menu && (
                                            <div className="col-md-6 col-lg-3">
                                                <div className="card action-card shadow-sm h-100">
                                                    <div className="card-body d-flex flex-column justify-content-between">
                                                        <FaFileAlt className="action-icon mb-3" />
                                                        <h5>Create Menu</h5>
                                                        <button
                                                            className="btn btn-warning w-100"
                                                            onClick={() => {
                                                                if (restaurant.id) {
                                                                    console.log('Navigating to create menu page...');
                                                                    navigate(`/restaurant/${restaurant.id}/create-menu`);
                                                                } else {
                                                                    console.log('Restaurant ID not available for navigation');
                                                                }
                                                            }}
                                                        >
                                                            <FaFileAlt className="me-2" /> Create Menu
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {menuId && (
                                            <>
                                                <div className="col-md-6 col-lg-3">
                                                    <div className="card action-card shadow-sm h-100">
                                                        <div className="card-body d-flex flex-column justify-content-between">
                                                            <FaUtensils className="action-icon mb-3" />
                                                            <h5>View Your Menu</h5>
                                                            <button
                                                                className="btn btn-info w-100"
                                                                onClick={() => {
                                                                    if (menuId) {
                                                                        console.log('Navigating to view menu page...');
                                                                        navigate(`/restaurant/${menuId}/view-menu`);
                                                                    } else {
                                                                        console.log('Menu ID not available for navigation');
                                                                    }
                                                                }}
                                                            >
                                                                <FaUtensils className="me-2" /> View Your Menu !
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-md-6 col-lg-3">
                                                    <div className="card action-card shadow-sm h-100">
                                                        <div className="card-body d-flex flex-column justify-content-between">
                                                            <FaEdit className="action-icon mb-3" />
                                                            <h5>Edit Your Menu</h5>
                                                            <button
                                                                className="btn btn-primary w-100"
                                                                onClick={() => {
                                                                    if (menuId) {
                                                                        console.log('Navigating to edit menu page...');
                                                                        navigate(`/restaurant/${menuId}/edit-menu`);
                                                                    } else {
                                                                        console.log('Menu ID not available for navigation');
                                                                    }
                                                                }}
                                                            >
                                                                <FaEdit className="me-2" /> Edit Menu
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                {!hasQRCode ? (
                                                    <div className="col-md-6 col-lg-3">
                                                        <div className="card action-card shadow-sm h-100">
                                                            <div className="card-body d-flex flex-column justify-content-between">
                                                                <FaQrcode className="action-icon mb-3" />
                                                                <h5>Generate QR Code</h5>
                                                                <button
                                                                    className="btn btn-primary w-100"
                                                                    onClick={handleGenerateQRCode}
                                                                >
                                                                    <FaQrcode className="me-2" /> Generate QR Code
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="col-md-6 col-lg-3">
                                                        <div className="card action-card shadow-sm h-100">
                                                            <div className="card-body d-flex flex-column justify-content-between">
                                                                <FaQrcode className="action-icon mb-3" />
                                                                <h5>Download QR Code</h5>
                                                                <button
                                                                    className="btn btn-secondary w-100"
                                                                    onClick={handleDownloadQRCode}
                                                                >
                                                                    <FaQrcode className="me-2" /> Download QR Code
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RestaurantDashboard;
