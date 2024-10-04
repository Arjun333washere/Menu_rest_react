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
    navigate(`/restaurant-dashboard/${restaurantId}`); // Use the actual restaurantId
  };
  

  useEffect(() => {
    fetchFoodItems(); 
  }, [fetchFoodItems]); // Include fetchFoodItems in dependencies

  return (

    <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#F3F7FA' }}>
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <div className="card p-4 shadow-lg mb-4">
              <h2 className="text-dark text-center mb-4">Add Food Item</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label text-gray">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label text-gray">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    className="form-control"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="price" className="form-label text-gray">Price</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    className="form-control"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="food_type" className="form-label text-gray">Food Type</label>
                  <select
                    id="food_type"
                    name="food_type"
                    className="form-select"
                    value={formData.food_type}
                    onChange={handleChange}
                  >
                    <option value="main_course">Main Course</option>
                    <option value="dessert">Dessert</option>
                    <option value="drink">Drink</option>
                  </select>
                </div>
                {error && <p className="text-danger">{error}</p>}
                <div className="d-grid">
                  <button type="submit" className="btn">
                    Add Food Item
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card p-4 shadow-lg">
              <h2 className="text-dark text-center mb-4">Your Food Items</h2>
              <table className="table table-striped">
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
