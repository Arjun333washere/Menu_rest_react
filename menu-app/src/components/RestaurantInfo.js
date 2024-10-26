import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

import { FaTrash } from 'react-icons/fa'; // Import icons for buttons
// import { useAuth } from '../provider/authProvider'; // Adjust path if necessary

const RestaurantInfo = () => {
    const { id } = useParams(); // Restaurant ID from URL
    const [restaurant, setRestaurant] = useState(null);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false); // For showing the custom confirmation modal
    const navigate = useNavigate();

    // Fetch restaurant details when the component loads
    useEffect(() => {
        const fetchRestaurantDetails = async () => {
            try {
                const access_token = localStorage.getItem('token'); // Get the token
                if (!access_token) {
                    setError('No access token found. Redirecting to 404 page.');
                    navigate('/nun'); // Redirect to 404 if no token is found
                    return;
                }

                // Fetch restaurant data with authorization header
                const response = await axios.get(`http://localhost:8000/menu/restaurants/${id}/`, {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                });
                setRestaurant(response.data); // Store restaurant data
            } catch (err) {
                console.error('Failed to fetch restaurant:', err);
                setError('Failed to fetch restaurant details.');
            }
        };
        fetchRestaurantDetails();
    }, [id, navigate]);

    // Handle delete restaurant
    const handleDelete = async () => {
        try {
            const access_token = localStorage.getItem('token');
            if (!access_token) {
                setError('No access token found.');
                return;
            }

            await axios.delete(`http://127.0.0.1:8000/menu/restaurants/${id}/`, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            });

            navigate('/'); // Redirect to homepage after deletion
        } catch (error) {
            console.error('Error deleting restaurant:', error);
            setError('Failed to delete restaurant.');
        }
    };

    // const { logout } = useAuth(); // Access the logout function
    // Open confirmation modal
    const openModal = () => setShowModal(true);

    // Close confirmation modal
    const closeModal = () => setShowModal(false);

    // Navigate to the edit page
    const handleEdit = () => {
        navigate(`/restaurant/${id}/edit`); // Navigate to the edit page for this restaurant
    };

    const handleBackToDashboard = () => {
        navigate(`/restaurant-dashboard/${id}`); // Navigate to the restaurant dashboard
    };


    if (error) {
        return <div className="text-danger">{error}</div>; // Display error message
    }

    return restaurant ? (
        // UI h2 className="text-dark" style={{ fontWeight: '700', fontSize: '2rem' }}
        <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#F3F7FA' }}>
    <div className="container d-flex justify-content-center">
        <div className="row">
            <div className="col-md-12">

                <div className="card p-4 shadow-lg mb-4" style={{ width: '100%', maxWidth: '1200px' }}>
                    <h1 className="text-dark text-center" style={{ fontFamily: "'Raleway', sans-serif", fontWeight: '900', fontSize: '2.5rem', marginBottom: '20px', color: '#1A1A1C' }}>RESTAURANT INFORMATION</h1>
                    <p className="text-gray"><strong>Name:</strong> {restaurant.name}</p>
                    <p className="text-gray"><strong>Description:</strong> {restaurant.description}</p>
                    <p className="text-gray"><strong>Address:</strong> {restaurant.address}</p>
                    <p className="text-gray"><strong>Phone:</strong> {restaurant.phone_number}</p> {/* Updated to use phone_number */}
                    <p className="text-gray"><strong>Logo:</strong> <img src={restaurant.logo} alt={restaurant.name} style={{ width: '150px' }} /></p>
                    <p className="text-gray"><strong>Has Menu:</strong> {restaurant.has_menu ? 'Yes' : 'No'}</p> {/* Display has_menu */}
                    <p className="text-gray"><strong>Has QR Code:</strong> {restaurant.has_qr_code ? 'Yes' : 'No'}</p> {/* Display has_qr_code */}
                    
                    <div className="d-grid mt-3">
                        <button className="btn w-100" style={{ backgroundColor: '#003366' }} onClick={handleEdit}>
                            Edit Restaurant
                        </button>
                    </div>
                    
                    {/* Delete Button */}
                    <div className="d-grid mt-3">
                        <button className="btn btn-danger w-100" onClick={openModal}>
                            <FaTrash className="me-2" /> Delete Restaurant 
                        </button>
                    </div>
                     {/* Add Logout Button
                     <div className="d-grid mt-3">
                                <button className="btn btn-warning w-100" onClick={logout}>
                                    Logout
                                </button>
                    </div> */}
                    <div className="d-grid mt-3">
                        <button className="btn w-100"style={{ backgroundColor: '#003366' }} onClick={handleBackToDashboard}>
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    {/* Custom Confirmation Modal */}
    {showModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Confirm Delete</h5>
                        <button type="button" className="btn-close" onClick={closeModal}></button>
                    </div>
                    
                    <div className="modal-body">
                        <p>Are you sure you want to delete this restaurant? This action is permanent and cannot be undone.</p>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-danger" onClick={() => { handleDelete(); closeModal(); }}>Yes, Delete</button>
                        <button className="btn btn-secondary" onClick={closeModal}>No, Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    )}
</div>

    ) : (
        <div>Loading...</div>
    );
};

export default RestaurantInfo;
