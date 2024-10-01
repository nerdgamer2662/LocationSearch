import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import LandingPage from "./components/LandingPage";
import SignUpForm from "./components/SignUpForm";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard"; // Import the Dashboard component

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/signup">Sign Up</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
            </ul>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignUpForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/dashboard" element={<Dashboard />} />{" "}
            {/* Add this line */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
