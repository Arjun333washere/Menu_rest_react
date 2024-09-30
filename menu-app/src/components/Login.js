import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"  // Added autocomplete attribute
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"  // Added autocomplete attribute
          />
        </div>
        {error && <p>{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
