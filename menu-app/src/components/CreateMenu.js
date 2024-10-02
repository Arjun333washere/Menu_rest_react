import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useRestaurant } from '../context/RestaurantContext'; // Import the RestaurantContext

const CreateMenu = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const { restaurantId } = useRestaurant(); // Get the restaurantId from context
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const accessToken = localStorage.getItem('access_token');
      const response = await axios.post('http://127.0.0.1:8000/menu/menus/', {
        title,
        description,
        restaurant: restaurantId, // Use the restaurantId from context
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 201) {
        // Navigate to the add food item page after successful menu creation
        navigate(`/restaurant/${restaurantId}/add-food`);
      }
    } catch (error) {
      console.error('Error creating menu:', error);
      setError('Failed to create menu. Please try again.');
    }
  };

  return (
    <div>
      <h2>Create Menu</h2>
      {restaurantId ? ( // Check if restaurantId exists
        <form onSubmit={handleSubmit}>
          <div>
            <label>Menu Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
          <button type="submit">Create Menu</button>
        </form>
      ) : (
        <p>No restaurant found. Please create a restaurant first.</p>
      )}
    </div>
  );
};

export default CreateMenu;
