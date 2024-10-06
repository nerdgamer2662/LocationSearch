import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const handleMapNavigation = () => {
    navigate("/map");
  };

  return (
    <div className="dashboard-container">
      <h1>Welcome to Your Dashboard</h1>
      <p>You have successfully logged in!</p>
      <button onClick={handleMapNavigation} className="map-button">
        Go to Map
      </button>
    </div>
  );
}

export default Dashboard;