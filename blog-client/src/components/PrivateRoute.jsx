import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const authed = false;
    console.log('dadadad')
  return authed ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
