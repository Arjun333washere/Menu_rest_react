import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useRestaurant } from '../context/RestaurantContext'; 
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../provider/authProvider'; // Import the useAuth hook for token management
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap import

const AddFoodItem = () => {
  const { restaurantId } = useRestaurant(); // Get restaurantId from context
  const { token } = useAuth(); // Get the token from AuthContext
  const [formData, setFormData] = useState({
    name: '',
    fd_description: '',
    price: '',
    food_type: 'main_course', // Default to main_course
    veg_or_non_veg: 'non_veg', // Default to non_veg
    special: false, // Default to not special
});

  const [error, setError] = useState('');
  const [foodItems, setFoodItems] = useState([]);
  const navigate = useNavigate();

  // Handle input field changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission for adding food item
  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSubmit = { ...formData, restaurant: restaurantId };

    try {
      // Check if token exists before making request
      if (!token) {
        setError('No access token found. Redirecting to login page.');
        navigate('/login'); // Redirect to login if token is missing
        return;
      }

      await axios.post('http://localhost:8000/menu/food-items/', dataToSubmit, {
        headers: {
          Authorization: `Bearer ${token}`, // Use token from AuthContext
        },
      });
      fetchFoodItems(); // Refresh food items after adding
    } catch (error) {
      console.error('Failed to add food item:', error.response?.data);
      setError('Failed to add food item.');
    }
  };

  // Fetch food items for the restaurant
  const fetchFoodItems = useCallback(async () => {
    try {
      if (!token) {
        setError('No access token found. Redirecting to login page.');
        navigate('/login'); // Redirect if no token
        return;
      }

      const response = await axios.get(`http://localhost:8000/menu/food-items/?restaurant=${restaurantId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Use token from AuthContext
        },
      });
      setFoodItems(response.data);
    } catch (error) {
      console.error('Failed to fetch food items:', error.response?.data);
      setError('Failed to fetch food items.');
    }
  }, [restaurantId, token, navigate]);

  // Handle deleting a food item
  const handleDelete = async (id) => {
    try {
      if (!token) {
        setError('No access token found. Redirecting to login page.');
        navigate('/login');
        return;
      }

      await axios.delete(`http://localhost:8000/menu/food-items/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`, // Use token from AuthContext
        },
      });
      fetchFoodItems(); // Refresh food items after deletion
    } catch (error) {
      console.error('Failed to delete food item:', error.response?.data);
      setError('Failed to delete food item.');
    }
  };

    // Navigate to the restaurant dashboard using restaurantId
    const handleBackToDashboard = () => {
      navigate(`/restaurant-dashboard/${restaurantId}`);
  };

  // Fetch food items on component mount
  useEffect(() => {
    fetchFoodItems();
  }, [fetchFoodItems]);

  return (
<div className="d-flex justify-content-center align-items-start" style={{ backgroundColor: '#F3F7FA', padding: '20px' }}>
  <div className="container">
    <div className="row justify-content-center">
      <div className="col-12 col-md-10 col-lg-8">

        {/* Card for Adding Food Item */}
        <div className="card p-4 shadow-lg mb-4" style={{ borderRadius: '15px', border: '1px solid #dee2e6', marginBottom: '30px' }}>
          <h1 className="text-dark text-center" style={{ fontFamily: "'Raleway', sans-serif", fontWeight: '900', fontSize: '2.5rem', marginBottom: '20px', color: '#1A1A1C' }}>ADD NEW FOOD</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label text-black">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
                style={{ borderRadius: '8px' }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="fd_description" className="form-label text-black">Description</label>
              <textarea
                id="fd_description"
                name="fd_description"
                className="form-control"
                value={formData.fd_description}
                onChange={handleChange}
                required
                rows="3"
                style={{ borderRadius: '8px' }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="price" className="form-label text-black">Price</label>
              <input
                type="number"
                id="price"
                name="price"
                className="form-control"
                value={formData.price}
                onChange={handleChange}
                required
                style={{ borderRadius: '8px' }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="food_type" className="form-label text-black">Food Type</label>
              <select
                id="food_type"
                name="food_type"
                className="form-select"
                value={formData.food_type}
                onChange={handleChange}
                style={{ borderRadius: '8px' }}
              >
                <option value="main_course">Main Course</option>
                <option value="dessert">Dessert</option>
                <option value="drink">Drink</option>
                <option value="appetizer">Appetizer</option>
                <option value="side">Side</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="veg_or_non_veg" className="form-label text-black">Vegetarian or Non-Vegetarian</label>
              <select
                id="veg_or_non_veg"
                name="veg_or_non_veg"
                className="form-select"
                value={formData.veg_or_non_veg}
                onChange={handleChange}
                style={{ borderRadius: '8px' }}
              >
                <option value="veg">Vegetarian</option>
                <option value="non_veg">Non-Vegetarian</option>
              </select>
            </div>
            <div className="mb-3 form-check">
              <input
                type="checkbox"
                id="special"
                name="special"
                className="form-check-input"
                checked={formData.special}
                onChange={(e) => setFormData({ ...formData, special: e.target.checked })}
              />
              <label htmlFor="special" className="form-check-label">Special Item</label>
            </div>
            {error && <p className="text-danger">{error}</p>}
            <div className="d-grid">
              <button type="submit" className="btn btn-dark" style={{ borderRadius: '8px' }}>
                Add Food Item
              </button>
            </div>
          </form>
        </div>

        {/* Card for Displaying Food Items */}
        <div className="card p-4 shadow-lg" style={{ borderRadius: '15px', border: '1px solid #dee2e6', marginBottom: '30px' }}>
          <h1 className="text-dark text-center" style={{ fontFamily: "'Raleway', sans-serif", fontWeight: '900', fontSize: '2.5rem', marginBottom: '20px', color: '#1A1A1C' }}>YOUR FOOD ITEMS</h1>
          <table className="table table-striped table-hover">
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
                  <td>{foodItem.fd_description}</td> {/* Updated field name */}
                  <td>{foodItem.price}</td>
                  <td>{foodItem.food_type}</td>
                  <td>
                    <button className="btn btn-primary me-2" onClick={() => navigate(`/edit-food-item/${foodItem.id}`)}>Edit</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(foodItem.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="d-grid mt-3">
            <button className="btn btn-secondary" onClick={handleBackToDashboard}>Back to Dashboard</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


  );
};

export default AddFoodItem;
