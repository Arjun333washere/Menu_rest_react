import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const RestaurantInfo = () => {
    const { id } = useParams(); // Restaurant ID from URL
    const [restaurant, setRestaurant] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Fetch restaurant details when the component loads
    useEffect(() => {
        const fetchRestaurantDetails = async () => {
            const access_token = localStorage.getItem('access_token');
            try {
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
    }, [id]);

    // Navigate to the edit page
    const handleEdit = () => {
        navigate(`/restaurant/${id}/edit`); // Navigate to the edit page for this restaurant
    };

    const handleBackToDashboard = () => {
        navigate(`/restaurant-dashboard/${id}`); // Use the actual restaurantId
      };

    if (error) {
        return <div>{error}</div>;
    }

    return restaurant ? (



    //ui 
        <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#F3F7FA' }}>
          <div className="container d-flex justify-content-center">
            <div className="row">
              <div className="col-md-12">
                <div className="card p-4 shadow-lg mb-4" style={{ width: '100%', maxWidth: '1200px' }}>
                  <h2 className="text-dark text-center mb-4">Restaurant Information</h2>
                  <p><strong>Name:</strong> {restaurant.name}</p>
                  <p><strong>Description:</strong> {restaurant.description}</p>
                  <p><strong>Address:</strong> {restaurant.address}</p>
                  <p><strong>Phone:</strong> {restaurant.phone}</p>
                  <p><strong>Logo:</strong> <img src={restaurant.logo} alt={restaurant.name} style={{ width: '150px' }} /></p>
                  <div className="d-grid mt-3">
                    <button className="btn btn-primary" onClick={handleEdit}>Edit Restaurant</button>
                  </div>
                  <div className="d-grid mt-3">
                    <button className="btn btn-secondary" onClick={handleBackToDashboard}>Back to Dashboard</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    //yui end 
    ) : (
        <div>Loading...</div>
    );
};

export default RestaurantInfo;
