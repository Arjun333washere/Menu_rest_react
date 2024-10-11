import React, { useState, useEffect } from 'react'; // Removed useCallback import
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditFoodItem = () => {
  const { foodItemId } = useParams(); 
  const [formData, setFormData] = useState({
    name: '',
    fd_description: '', // Updated to fd_description
    price: '',
    food_type: 'main_course', 
    veg_or_non_veg: 'veg', // Default value
    special: false, // Default value
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
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
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
      navigate(-1); 
    } catch (error) {
      console.error('Failed to update food item:', error.response.data);
      setError('Failed to update food item.');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#F3F7FA' }}>
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <div className="card p-4 shadow-lg mb-4">
              <h2 className="text-dark text-center mb-4">Edit Food Item</h2>
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
                    name="fd_description" // Updated to fd_description
                    className="form-control"
                    value={formData.fd_description} // Updated to fd_description
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
                    Update Food Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditFoodItem;
