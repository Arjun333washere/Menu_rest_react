import React, { useState, useEffect, useCallback } from 'react'; 
import axios from 'axios';
import { useRestaurant } from '../context/RestaurantContext'; 
import { useNavigate } from 'react-router-dom'; 

const AddFoodItem = () => {
  const { restaurantId } = useRestaurant(); 
  const [formData, setFormData] = useState({
    name: '',
    fd_description: '', // Updated field name
    price: '',
    food_type: 'main_course', 
    veg_or_non_veg: 'veg', // Default value
    special: false, // Default value
  });
  const [error, setError] = useState('');
  const [foodItems, setFoodItems] = useState([]);
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
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
      // Clear form after submission
      setFormData({
        name: '',
        fd_description: '', // Clear fd_description
        price: '',
        food_type: 'main_course',
        veg_or_non_veg: 'veg',
        special: false,
      });
      setError(''); // Reset error message
    } catch (error) {
      console.error('Failed to add food item:', error.response.data);
      setError('Failed to add food item.');
    }
  };

  const fetchFoodItems = useCallback(async () => {
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
  }, [restaurantId]);

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
    navigate(`/restaurant-dashboard/${restaurantId}`);
  };

  useEffect(() => {
    fetchFoodItems(); 
  }, [fetchFoodItems]);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#F3F7FA' }}>
      <div className="container">
        <div className="row">
          {/* Add Food Item Form */}
          <div className="col-md-12">
            <div className="card p-4 shadow-lg mb-4" style={{ maxWidth: '750px', margin: '0 auto' }}>
              <h2 className="text-dark text-center mb-4" >Add Food Item</h2>
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
                  <label htmlFor="fd_description" className="form-label text-gray">Description</label>
                  <textarea
                    id="fd_description"
                    name="fd_description" // Updated name for textarea
                    className="form-control"
                    value={formData.fd_description}
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
                    <option value="appetizer">Appetizer</option>
                    <option value="side">Side</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="veg_or_non_veg" className="form-label text-gray">Vegetarian or Non-Vegetarian</label>
                  <select
                    id="veg_or_non_veg"
                    name="veg_or_non_veg"
                    className="form-select"
                    value={formData.veg_or_non_veg}
                    onChange={handleChange}
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
                    onChange={handleChange}
                  />
                  <label htmlFor="special" className="form-check-label text-gray">Is this a special item?</label>
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

          {/* Food Items List */}
          <div className="col-md-12" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div className="card p-4 shadow-lg">
              <h2 className="text-dark text-center mb-4">Your Food Items</h2>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Food Type</th>
                    <th>Veg/Non-Veg</th>
                    <th>Special</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {foodItems.map((foodItem) => (
                    <tr key={foodItem.id}>
                      <td>{foodItem.name}</td>
                      <td>{foodItem.fd_description}</td> {/* Updated field */}
                      <td>{foodItem.price}</td>
                      <td>{foodItem.food_type}</td>
                      <td>{foodItem.veg_or_non_veg}</td>
                      <td>{foodItem.special ? 'Yes' : 'No'}</td>
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
