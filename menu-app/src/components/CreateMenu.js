import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useRestaurant } from '../context/RestaurantContext';

import '../common.css'; // Import common styles

const CreateMenu = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const { restaurantId } = useRestaurant();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const accessToken = localStorage.getItem('access_token');
      const response = await axios.post('http://127.0.0.1:8000/menu/menus/', {
        title,
        description,
        restaurant: restaurantId,
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 201) {
        navigate(`/restaurant/${restaurantId}/add-food`);
      }
    } catch (error) {
      console.error('Error creating menu:', error);
      setError('Failed to create menu. Please try again.');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#F3F7FA' }}>
      <div className="card p-4 shadow-lg" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-dark text-center mb-4">Create Menu</h2>
        {restaurantId ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label text-gray">Menu Title</label>
              <input
                type="text"
                id="title"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label text-gray">Description</label>
              <textarea
                id="description"
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-danger">{error}</p>}
            <div className="d-grid">
              <button type="submit" className="btn">
                Create Menu
              </button>
            </div>
          </form>
        ) : (
          <p className="text-danger text-center">No restaurant found. Please create a restaurant first.</p>
        )}
      </div>
    </div>
  );
};

export default CreateMenu;
