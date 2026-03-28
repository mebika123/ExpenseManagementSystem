import React from 'react'
import { useAuth } from './context/AuthContext';
import { Navigate } from 'react-router-dom';
import { can } from './utils/permission';

const ProtectedRoute = ({ permission, children }) => {
  const { permissions } = useAuth();


  return can(permission, permissions)
    ? children
    : <Navigate to="/403" />;
};

export default ProtectedRoute