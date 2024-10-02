import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useRestaurant } from '../context/RestaurantContext'; // Import the RestaurantContext

const CreateRestaurant = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setRestaurantId } = useRestaurant(); // Get the setRestaurantId function from context

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const accessToken = localStorage.getItem('access_token');
      const response = await axios.post('http://127.0.0.1:8000/menu/restaurants/', {
        name,
        description,
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 201) {
        const restaurantId = response.data.id; // Get the ID of the created restaurant
        setRestaurantId(restaurantId); // Store the restaurant ID in context
        // Navigate to the create menu page, including the restaurant ID
        navigate(`/restaurant/${restaurantId}/create-menu`);
      }
    } catch (error) {
      console.error('Error creating restaurant:', error);
      setError('Failed to create restaurant. Please try again.');
    }
  };

  return (
    <div>
      <h2>Create Restaurant</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Restaurant Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        {error && <p>{error}</p>}
        <button type="submit">Create Restaurant</button>
      </form>
    </div>
  );
};

export default CreateRestaurant;
