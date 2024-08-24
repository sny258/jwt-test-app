// components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';

function PrivateRoute({ element: Component, ...rest }) {
  // hooks 
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if the user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const checkAuth = async () => {
        try {
          const response = await axios.get('http://localhost:5000/authenticated', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }, {
            validateStatus: function (status) {
              return status < 500; // Resolve only if the status code is less than 500
            }
          });
          console.log('Response:', response);
          if (response.status === 200) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error('Authentication error:', error.response?.data?.message || error.message);
          setIsAuthenticated(false);
        }
        setLoading(false);
      };      
      checkAuth();
    }
    else {
      console.log('No token found');
      setIsAuthenticated(false);
      setLoading(false);
    }
  }
  , []);

  // Show a loading spinner while checking authentication
  if (loading) {
    // return <div>Loading...</div>; 
    return null;
  
  }
  // If the user is authenticated, render the component
  return isAuthenticated ? <Component {...rest} /> : <Navigate to="/login" />;

}

export default PrivateRoute;
