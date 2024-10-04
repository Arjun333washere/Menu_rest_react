import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import '../common.css'; // Import common styles
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap

const Login = ({ setAuthTokens }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:8000/auth/api/login/', {
        username,
        password,
      });

      if (response.data) {
        const { access, refresh, has_restaurant, restaurant_id } = response.data;

        // Update tokens in parent component and localStorage
        setAuthTokens({ access, refresh });
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);

        console.log("Login successful:", response.data);

        // Redirect based on restaurant ownership
        if (has_restaurant) {
          navigate(`/restaurant-dashboard/${restaurant_id}`);
        } else {
          console.log('Navigating to /create-restaurant');
          navigate('/create-restaurant');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#F3F7FA' }}>
      <div className="card p-4 shadow-lg" style={{ width: '100%', maxWidth: '400px' }}>
        <h1 className="text-dark text-center mb-4">LOGIN</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label text-gray">Username</label>
            <input
              type="text"
              id="username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label text-gray">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-danger">{error}</p>}
          <div className="d-grid">
            <button type="submit" className="btn">
              LOGIN
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
