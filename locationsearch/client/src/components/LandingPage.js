import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";

function LandingPage() {
  return (
    <div className="landing-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to LocationSearch at Georgia Tech!</h1>
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
      </section>
    </div>
  );
}

export default LandingPage;