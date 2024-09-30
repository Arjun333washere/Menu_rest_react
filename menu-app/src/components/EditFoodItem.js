import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditFoodItem = () => {
  const { foodItemId } = useParams(); 
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    food_type: 'main_course', 
  });
  const [error, setError] = useState('');
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchFoodItem = async () => {
      const access_token = localStorage.getItem('access_token');
      try {
        const response = await axios.get(`http://localhost:8000/menu/food-items/${foodItemId}/`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
        setFormData(response.data); 
      } catch (error) {
        console.error('Failed to fetch food item:', error.response?.data);
        setError('Failed to fetch food item.');
      }
    };

    fetchFoodItem(); 
  }, [foodItemId]);

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
      await axios.put(`http://localhost:8000/menu/food-items/${foodItemId}/`, formData, {
        headers: {
          Authorization: `Bearer ${access_token}`, 
        },
      });
      // Navigate to the previous page
      navigate(-1); 
    } catch (error) {
      console.error('Failed to update food item:', error.response.data);
      setError('Failed to update food item.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div>
        <label>Description:</label>
        <textarea name="description" value={formData.description} onChange={handleChange} required />
      </div>
      <div>
        <label>Price:</label>
        <input type="number" name="price" value={formData.price} onChange={handleChange} required />
      </div>
      <div>
        <label>Food Type:</label>
        <select name="food_type" value={formData.food_type} onChange={handleChange}>
          <option value="main_course">Main Course</option>
          <option value="dessert">Dessert</option>
          <option value="drink">Drink</option>
        </select>
      </div>
      <button type="submit">Update Food Item</button>
      {error && <p>{error}</p>}
    </form>
  );
};

export default EditFoodItem;
