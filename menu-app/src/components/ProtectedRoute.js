import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../provider/authProvider';

const ProtectedRoute = () => {
  const { token } = useAuth();

  // If the user has no auth token, redirect to login page
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
