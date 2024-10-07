import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginForm.css";
import { API_BASE_URL } from "../config";
import { AuthContext } from "../components/AuthContext";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/users/login`,
        { username, password },
        { withCredentials: true }
      );
      const { token } = response.data; // Assuming the token is in response.data.token
      localStorage.setItem("token", token);
      localStorage.setItem("username", username); // Store the username
      login(username); // Update context

      alert("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data || "An error occurred during login");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h1>Sign In</h1>
        <p>Enter your credentials to use the Map Page</p>
        {error && <p className="error">{error}</p>}
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
          className="login-input"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="login-input"
        />
        <button type="submit" className="login-button">
          Log In
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
