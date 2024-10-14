import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useRestaurant } from '../context/RestaurantContext'; // Import the restaurant context

const EditMenu = () => {
    const { id } = useParams(); // Menu ID from URL
    const { restaurantId } = useRestaurant(); // Get restaurantId from context
    const [menu, setMenu] = useState({
        title: '',
        mn_description: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Fetch the menu details on component mount
    useEffect(() => {
        const fetchMenuDetails = async () => {
            try {
                // Check if the access token is available
                const accessToken = localStorage.getItem('token');
                if (!accessToken) {
                    navigate('/login'); // Redirect to login if not authenticated
                    return;
                }

                const response = await axios.get(`http://127.0.0.1:8000/menu/menus/${id}/`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setMenu(response.data); // Store menu data
            } catch (err) {
                console.error('Failed to fetch menu:', err);
                setError('Failed to load menu details.');
            } finally {
                setLoading(false);
            }
        };
        fetchMenuDetails();
    }, [id, navigate]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMenu({
            ...menu,
            [name]: value,
        });
    };

    // Handle form submission (PATCH request)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const accessToken = localStorage.getItem('token'); // Get the access token
            await axios.patch(`http://127.0.0.1:8000/menu/menus/${id}/`, menu, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            navigate(`/restaurant-dashboard/${restaurantId}`); // Navigate back to the dashboard
        } catch (err) {
            console.error('Failed to update menu:', err);
            setError('Failed to update menu.');
        }
    };

    // Navigate to the restaurant dashboard using restaurantId
    const handleBackToDashboard = () => {
        navigate(`/restaurant-dashboard/${restaurantId}`);
    };

    if (loading) {
        return <div>Loading...</div>; // Display loading state
    }

    if (error) {
        return <div className="text-danger">{error}</div>; // Display error message
    }

    return (
        <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#F3F7FA' }}>
            <div className="container d-flex justify-content-center">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card p-4 shadow-lg mb-4" style={{ width: '150%', maxWidth: '1200px' }}>
                            <h2 className="text-dark text-center mb-4">Edit Menu</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">Menu Title:</label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        className="form-control"
                                        value={menu.title}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="mn_description" className="form-label">Description:</label>
                                    <textarea
                                        id="mn_description"
                                        name="mn_description"
                                        className="form-control"
                                        value={menu.mn_description}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Update Menu</button>
                            </form>
                            <div className="d-grid mt-3">
                                <button className="btn btn-secondary" onClick={handleBackToDashboard}>
                                    Back to Dashboard
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditMenu;
