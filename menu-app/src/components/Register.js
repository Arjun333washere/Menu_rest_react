import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import '../common.css'; // Import common styles
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap

const Register = () => {
  const [mobileNumber, setMobileNumber] = useState(''); // State for mobile number
  const [username, setUsername] = useState(''); // State for username
  const [email, setEmail] = useState(''); // Email can be optional
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // New confirm password field
  const [role, setRole] = useState('manager'); // Default to 'manager'
  const [error, setError] = useState(null); // To store server-side error
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/auth/register/', {
        mobile_number: mobileNumber,  // Using mobile number
        username,  // Adding username field
        email: email || null,  // Send null if email is blank
        password,
        confirm_password: confirmPassword,  // Adding confirm_password field to match the server requirements
        user_type: role,  // Updated to send user_type (as per your model)
      });

      if (response.status === 201) {
        // Redirect to login or dashboard after successful registration
        navigate('/login');
      }
    } catch (error) {
      if (error.response) {
        console.error('Registration error response:', error.response.data); // Log the detailed error from the server
        // Extract error messages from the response
        const errorData = error.response.data;
        let errorMessage = '';

        if (errorData.mobile_number) {
          errorMessage = `Mobile Number: ${errorData.mobile_number.join(', ')}`;
        } else if (errorData.password) {
          errorMessage = `Password: ${errorData.password.join(', ')}`;
        } else if (errorData.email) {
          errorMessage = `Email: ${errorData.email.join(', ')}`;
        } else if (errorData.username) {
          errorMessage = `Username: ${errorData.username.join(', ')}`;
        } else if (errorData.confirm_password) {
          errorMessage = `Confirm Password: ${errorData.confirm_password.join(', ')}`;
        } else if (errorData.user_type) {
          errorMessage = `User Type: ${errorData.user_type.join(', ')}`;
        } else {
          errorMessage = 'Registration failed. Please check your inputs.';
        }

        setError(errorMessage); // Display error in the UI
      } else {
        setError('Registration failed. Please try again.'); // Generic error message
      }
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#F3F7FA' }}>
      <div className="card p-4 shadow-lg" style={{ width: '100%', maxWidth: '400px' }}>
        <h1 className="text-dark text-center" style={{ fontFamily: "'Raleway', sans-serif", fontWeight: '900', fontSize: '2.5rem', marginBottom: '20px', color: '#1A1A1C' }}>REGISTER</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-gray">Username</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label text-gray">Mobile Number</label>
            <input
              type="text"
              className="form-control"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label text-gray">Email (optional)</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label text-gray">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label text-gray">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label text-gray">Role</label>
            <select
              className="form-control"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="manager">Manager</option>
              <option value="owner">Owner</option>
              <option value="chef">Chef</option>
              <option value="waiter">Waiter</option>
            </select>
          </div>
          {error && <p className="text-danger">{error}</p>} {/* Display error messages */} 
          <div className="d-grid">
            <button type="submit" className="btn mx-2">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
