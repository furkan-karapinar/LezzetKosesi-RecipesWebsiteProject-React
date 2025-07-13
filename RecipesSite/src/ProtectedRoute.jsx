import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from './contexts/UserContext'; // UserContext yolunu kendine göre ayarla

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
    return <Navigate to="/login" replace />;
  }

  // Giriş yapılmışsa içeriği göster
  return children;
};

export default ProtectedRoute;
