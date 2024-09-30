import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useRestaurant } from '../context/RestaurantContext'; // Import the context

const RestaurantDashboard = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState(''); // State for QR code URL
  const navigate = useNavigate();
  const { setRestaurantId } = useRestaurant();

  useEffect(() => {
    const fetchRestaurant = async () => {
      const access_token = localStorage.getItem('access_token');
      try {
        const response = await axios.get(`http://127.0.0.1:8000/menu/restaurants/${id}/`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
        setRestaurant(response.data);
        setRestaurantId(id);
      } catch (error) {
        console.error('Error fetching restaurant:', error);
        setError('Failed to load restaurant details.');
      }
    };

    fetchRestaurant();
  }, [id, setRestaurantId]);

  const handleDelete = async () => {
    const access_token = localStorage.getItem('access_token');
    try {
      await axios.delete(`http://127.0.0.1:8000/menu/restaurants/${id}/`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      navigate('/');
    } catch (error) {
      console.error('Error deleting restaurant:', error);
      setError('Failed to delete restaurant.');
    }
  };

  // Function to generate QR code
  const handleGenerateQRCode = async () => {
    const access_token = localStorage.getItem('access_token');
    try {
      await axios.post(`http://127.0.0.1:8000/menu/menus/${id}/generate-qr-code/`, {}, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      setSuccessMessage('QR code generated successfully.');
    } catch (error) {
      console.error('Error generating QR code:', error);
      setError('Failed to generate QR code.');
    }
  };

  // New function to download the QR code
  const handleDownloadQRCode = async () => {
    const access_token = localStorage.getItem('access_token');
    try {
      const response = await axios.get(`http://127.0.0.1:8000/menu/menus/${id}/download-qr-code/`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        responseType: 'blob', // Important for downloading files
      });

      // Create a URL for the blob and set it to the state
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `qr_code_${id}.png`; // Set the filename
      document.body.appendChild(a);
      a.click(); // Trigger the download
      a.remove(); // Clean up
    } catch (error) {
      console.error('Error downloading QR code:', error);
      setError('Failed to download QR code.');
    }
  };

  if (error) {
    return <p>{error}</p>;
  }

  if (!restaurant) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>{restaurant.name}</h2>
      <p>{restaurant.description}</p>

      <button onClick={() => navigate(`/restaurant/${id}/info`)}>View Restaurant Info</button>
      <button onClick={() => navigate(`/restaurant/${id}/add-food`)}>Edit Food Item</button>
      <button onClick={() => navigate(`/restaurant/${id}/view-menu`)}>View Customer Menu</button>
      <button onClick={() => navigate(`/restaurant/${id}/create-menu`)}>Create Menu</button>
      
      {/* Generate QR Code Button */}
      <button onClick={handleGenerateQRCode}>Generate QR Code</button>

      {/* Download QR Code Button */}
      <button onClick={handleDownloadQRCode}>Download QR Code</button>
      
      <button onClick={handleDelete}>Delete Restaurant</button>

      {/* Success message display */}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
    </div>
  );
};

export default RestaurantDashboard;
