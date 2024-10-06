import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SignUpForm.css";
import { API_BASE_URL } from "../config";
import { AuthContext } from "../../../../locationsearch/client/src/components/AuthContext"; //locationsearch/client/src/components/AuthContext.js



function SignUpForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/users/signup`,
        { username, password },
        { withCredentials: true }
      );
      alert("Sign up successful!");
      const { token } = response.data; // Assuming the token is in response.data.token
      localStorage.setItem("token", token);
      localStorage.setItem("username", username); // Store the username
      login(username); // Update context

      navigate("/login");
      alert("Sign Up successful!");
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data || "An error occurred during sign up");
    }
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form">
        {error && <p className="error">{error}</p>}
        <h1>Sign Up</h1>
        <p>Enter your credentials to use the Map Page</p>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
          className="signup-input"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="signup-input"
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          required
          className="signup-input"
        />
        <button type="submit" className="signup-button">Sign Up</button>
      </form>
    </div>
  );
}

export default SignUpForm;