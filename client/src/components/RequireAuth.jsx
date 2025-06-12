import React from 'react';

import { Navigate } from 'react-router-dom';

const RequireAuth = ({ children, allowedRoles }) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const role = userInfo?.role;

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RequireAuth;