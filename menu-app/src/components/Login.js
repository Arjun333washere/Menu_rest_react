import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../provider/authProvider';
import axios from 'axios';

function Login() {
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { setToken } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    localStorage.removeItem('token');  // Clear any existing token
    localStorage.removeItem('refreshToken'); // Clear refresh token as well

    try {
        const response = await axios.post('http://127.0.0.1:8000/auth/api/login/', {
            mobile_number: mobileNumber,
            password: password,
        });
        console.log("Login successful:", response.data);

        const { access, refresh, has_restaurant, restaurant_id } = response.data;
        
        // Store the access and refresh tokens properly
        setToken(access);
        localStorage.setItem('token', access);
        localStorage.setItem('refreshToken', refresh);

        if (has_restaurant) {
            navigate(`/restaurant-dashboard/${restaurant_id}`);
        } else {
            navigate("/create-restaurant");
        }
    } catch (error) {
        const errorMsg = error.response?.data?.detail || "Login failed. Please check your mobile number or password.";
        console.error("Login failed", error.response?.data || error.message);
        setError(errorMsg);
    }
};


  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#F3F7FA' }}>
      <div className="card p-4 shadow-lg" style={{ width: '100%', maxWidth: '400px' }}>
        <h1 className="text-dark text-center" style={{ fontFamily: "'Raleway', sans-serif", fontWeight: '900', fontSize: '2.5rem', marginBottom: '20px', color: '#1A1A1C' }}>LOGIN</h1>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="mobileNumber" className="form-label text-gray">Mobile Number</label>
            <input
              type="text"
              id="mobileNumber"
              className="form-control"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              required
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
            />
          </div>
          {error && <p className="text-danger">{error}</p>}
          <div className="d-grid">
            <button type="submit" className="btn">Login</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
