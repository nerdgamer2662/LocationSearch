import React from "react";
import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="landing-page">
      <h1>Welcome to LocationSearch</h1>
      <p>Find interesting locations near you with ease!</p>
      <div className="cta-buttons">
        <Link to="/signup" className="btn btn-primary">
          Sign Up
        </Link>
        <Link to="/login" className="btn btn-secondary">
          Log In
        </Link>
      </div>
    </div>
  );
}

export default LandingPage;
