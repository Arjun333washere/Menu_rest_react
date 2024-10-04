import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditRestaurant = () => {
    const { id } = useParams(); // Restaurant ID from URL
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        address: '',
        phone: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Fetch restaurant details to populate the form when the component loads
    useEffect(() => {
        const fetchRestaurantDetails = async () => {
            const access_token = localStorage.getItem('access_token');
            try {
                const response = await axios.get(`http://localhost:8000/menu/restaurants/${id}/`, {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                });
                setFormData(response.data); // Populate the form with restaurant data
            } catch (err) {
                console.error('Failed to fetch restaurant:', err);
                setError('Failed to fetch restaurant details.');
            }
        };
        fetchRestaurantDetails();
    }, [id]);

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
            await axios.put(`http://localhost:8000/menu/restaurants/${id}/`, formData, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            });
            navigate(`/restaurant/${id}/info`); // Redirect back to the restaurant info page after editing
        } catch (err) {
            console.error('Failed to update restaurant:', err);
            setError('Failed to update restaurant.');
        }
    };

    return (
//ui

    <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#F3F7FA' }}>
      <div className="container d-flex justify-content-center">
        <div className="row">
          <div className="col-md-12">
            <div className="card p-4 shadow-lg mb-4" style={{ width: '200%', maxWidth: '2000px' }}>
              <h2 className="text-dark text-center mb-4">Edit Restaurant</h2>
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
                  <label htmlFor="address" className="form-label text-gray">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    className="form-control"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label text-gray">Phone</label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    className="form-control"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                {error && <p className="text-danger">{error}</p>}
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">
                    Update Restaurant
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

//ui
    );
};

export default EditRestaurant;
