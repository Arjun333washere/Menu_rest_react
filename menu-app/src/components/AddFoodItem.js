import React, { useState, useEffect, useCallback } from 'react'; // Import useCallback
import axios from 'axios';
import { useRestaurant } from '../context/RestaurantContext'; 
import { useNavigate } from 'react-router-dom'; 

const AddFoodItem = () => {
  const { restaurantId } = useRestaurant(); 
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    food_type: 'main_course', 
  });
  const [error, setError] = useState('');
  const [foodItems, setFoodItems] = useState([]);
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSubmit = { ...formData, restaurant: restaurantId }; 
    const access_token = localStorage.getItem('access_token'); 

    try {
      await axios.post('http://localhost:8000/menu/food-items/', dataToSubmit, {
        headers: {
          Authorization: `Bearer ${access_token}`, 
        },
      });
      fetchFoodItems(); 
    } catch (error) {
      console.error('Failed to add food item:', error.response.data);
      setError('Failed to add food item.');
    }
  };

  const fetchFoodItems = useCallback(async () => { // Use useCallback
    const access_token = localStorage.getItem('access_token'); 
    try {
      const response = await axios.get(`http://localhost:8000/menu/food-items/?restaurant=${restaurantId}`, {
        headers: {
          Authorization: `Bearer ${access_token}`, 
        },
      });
      setFoodItems(response.data); 
    } catch (error) {
      console.error('Failed to fetch food items:', error.response.data);
    }
  }, [restaurantId]); // Add restaurantId to dependencies

  const handleDelete = async (id) => {
    const access_token = localStorage.getItem('access_token'); 
    try {
      await axios.delete(`http://localhost:8000/menu/food-items/${id}/`, {
        headers: {
          Authorization: `Bearer ${access_token}`, 
        },
      });
      fetchFoodItems(); 
    } catch (error) {
      console.error('Failed to delete food item:', error.response.data);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/restaurant-dashboard'); // Change this to the appropriate route if needed
  };

  useEffect(() => {
    fetchFoodItems(); 
  }, [fetchFoodItems]); // Include fetchFoodItems in dependencies

  return (
    <>
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
        <button type="submit">Add Food Item</button>
        {error && <p>{error}</p>}
      </form>

      <h2>Your Food Items</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Food Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {foodItems.map((foodItem) => (
            <tr key={foodItem.id}>
              <td>{foodItem.name}</td>
              <td>{foodItem.description}</td>
              <td>{foodItem.price}</td>
              <td>{foodItem.food_type}</td>
              <td>
                <button onClick={() => navigate(`/edit-food-item/${foodItem.id}`)}>Edit</button>
                <button onClick={() => handleDelete(foodItem.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleBackToDashboard}>Back to Dashboard</button> {/* Back to Dashboard button */}
    </>
  );
};

export default AddFoodItem;
