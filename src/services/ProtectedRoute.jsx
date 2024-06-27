import React from 'react';
import { Navigate } from 'react-router-dom';

const isAuthenticated = () => {
    return sessionStorage.getItem('isAuthenticated') === 'true';
};

const ProtectedRoute = ({ children}) => {
    if (!isAuthenticated()) {
        return <Navigate to="/login" />;
    }
    return children;
};

export default ProtectedRoute;