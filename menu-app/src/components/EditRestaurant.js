import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditRestaurant = () => {
    const { id } = useParams(); // Restaurant ID from URL
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        address: '',
        phone: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Fetch restaurant details to populate the form when the component loads
    useEffect(() => {
        const fetchRestaurantDetails = async () => {
            const access_token = localStorage.getItem('access_token');
            try {
                const response = await axios.get(`http://localhost:8000/menu/restaurants/${id}/`, {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                });
                setFormData(response.data); // Populate the form with restaurant data
            } catch (err) {
                console.error('Failed to fetch restaurant:', err);
                setError('Failed to fetch restaurant details.');
            }
        };
        fetchRestaurantDetails();
    }, [id]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const access_token = localStorage.getItem('access_token');
        try {
            await axios.put(`http://localhost:8000/menu/restaurants/${id}/`, formData, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            });
            navigate(`/restaurant/${id}/info`); // Redirect back to the restaurant info page after editing
        } catch (err) {
            console.error('Failed to update restaurant:', err);
            setError('Failed to update restaurant.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Edit Restaurant</h2>
            <div>
                <label>Name:</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div>
                <label>Description:</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required />
            </div>
            <div>
                <label>Address:</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} required />
            </div>
            <div>
                <label>Phone:</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
            </div>
            <button type="submit">Update Restaurant</button>
            {error && <p>{error}</p>}
        </form>
    );
};

export default EditRestaurant;
