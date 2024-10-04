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
