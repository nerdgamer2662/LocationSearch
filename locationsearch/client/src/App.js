import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import LandingPage from "./components/LandingPage";
import SignUpForm from "./components/SignUpForm";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import Map from "./components/Map";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthContext } from "./components/AuthContext";

function App() {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [username, setUsername] = useState("");
  const { isLoggedIn, username, login, logout } = useContext(AuthContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Assuming the username is stored in localStorage for simplicity
      const storedUsername = localStorage.getItem("username");
      login(storedUsername);
      // setIsLoggedIn(true);
      // setUsername(storedUsername);
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              {!isLoggedIn && (
                <>
                  <li>
                    <Link to="/signup">Sign Up</Link>
                  </li>
                  <li>
                    <Link to="/login">Login</Link>
                  </li>
                </>
              )}
              <li>
                <Link to="/map">Map</Link>
              </li>
            </ul>
          </nav>
          <div className="auth-action">
            {isLoggedIn && (
              <button onClick={logout} className="logout-button">
                Logout
              </button>
            )}
          </div>
          <div className="auth-status">
            {isLoggedIn ? (
              <p>Welcome, {username}!</p>
            ) : (
              <p>You are not logged in.</p>
            )}
          </div>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignUpForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/map"
              element={
                <ProtectedRoute>
                  <Map />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
