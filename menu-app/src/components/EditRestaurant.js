import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditRestaurant = () => {
    const { id } = useParams(); // Restaurant ID from URL
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        address: '',
        phone_number: '',
        logo: null, // Initialize logo as null
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
                setFormData({
                    ...response.data,
                    logo: null, // Reset logo to null to allow re-uploading
                }); // Populate the form with restaurant data
            } catch (err) {
                console.error('Failed to fetch restaurant:', err);
                setError('Failed to fetch restaurant details.');
            }
        };
        fetchRestaurantDetails();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value, // Handle file input separately
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const access_token = localStorage.getItem('access_token');

        // Create a FormData object to handle the file upload
        const data = new FormData();
        data.append('name', formData.name); // Name is mandatory
        if (formData.description) {
            data.append('description', formData.description); // Add description only if provided
        }
        if (formData.address) {
            data.append('address', formData.address); // Add address only if provided
        }
        if (formData.phone_number) {
            data.append('phone_number', formData.phone_number); // Add phone number only if provided
        }
        if (formData.logo) {
            data.append('logo', formData.logo); // Add logo to FormData if provided
        }

        try {
            await axios.put(`http://localhost:8000/menu/restaurants/${id}/`, data, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    'Content-Type': 'multipart/form-data', // Set content type for file upload
                },
            });
            navigate(`/restaurant/${id}/info`); // Redirect back to the restaurant info page after editing
        } catch (err) {
            console.error('Failed to update restaurant:', err);
            setError('Failed to update restaurant.');
        }
    };

    return (
        // UI
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
                                        required // Keep this field required
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
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="phone_number" className="form-label text-gray">Phone</label>
                                    <input
                                        type="text"
                                        id="phone_number"
                                        name="phone_number"
                                        className="form-control"
                                        value={formData.phone_number}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="logo" className="form-label text-gray">Logo</label>
                                    <input
                                        type="file"
                                        id="logo"
                                        name="logo"
                                        className="form-control"
                                        onChange={handleChange}
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
        // UI
    );
};

export default EditRestaurant;
