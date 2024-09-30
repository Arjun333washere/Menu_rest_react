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

    if (error) {
        return <div>{error}</div>;
    }

    return restaurant ? (
        <div>
            <h2>Restaurant Information</h2>
            <p><strong>Name:</strong> {restaurant.name}</p>
            <p><strong>Description:</strong> {restaurant.description}</p>
            <p><strong>Address:</strong> {restaurant.address}</p>
            <p><strong>Phone:</strong> {restaurant.phone}</p>
            <p><strong>Logo:</strong> <img src={restaurant.logo} alt={restaurant.name} style={{ width: '150px' }} /></p>
            <button onClick={handleEdit}>Edit Restaurant</button>
        </div>
    ) : (
        <div>Loading...</div>
    );
};

export default RestaurantInfo;
