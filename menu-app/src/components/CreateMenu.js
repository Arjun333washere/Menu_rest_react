import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext'; 
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const CreateMenu = () => {
  const { restaurantId } = useRestaurant();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate for redirection

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const menuData = {
        title: title, // Your menu title
        restaurant: restaurantId // Replace with the actual restaurant ID that the user owns
    };

    const response = await fetch('http://localhost:8000/menu/menus/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify(menuData),
    });

    if (response.ok) {
        setMessage('Menu created successfully!');
        // Automatically redirect to the add food item page after successful creation
        navigate(`/restaurant/${restaurantId}/add-food`); // Adjust this route if needed
    } else {
        const data = await response.json();
        console.error('Error:', data);
        setMessage(data.restaurant ? data.restaurant[0] : 'Failed to create menu.'); // Show specific error message
    }
  };

  return (
    <div>
      <h2>Create Menu</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Menu Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Menu</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateMenu;
