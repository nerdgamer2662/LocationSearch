import React from "react";
import { Navigate } from "react-router-dom";

// ProtectedRoute component to protect routes like /map
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token"); // Check if the token is stored in localStorage

  if (!token) {
    // If no token, redirect to login page
    return <Navigate to="/login" replace />;
  }

  // If token exists, render the children (the protected component)
  return children;
}

export default ProtectedRoute;
