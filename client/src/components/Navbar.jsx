import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar-header">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">⚡</div>
          <span className="logo-text">
            Job<span className="logo-highlight">Sphere</span>
          </span>
        </Link>

        <nav className={`nav-menu ${mobileMenuOpen ? "active" : ""}`}>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/jobs"
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            onClick={() => setMobileMenuOpen(false)}
          >
            Find Jobs
          </NavLink>

          {user && user.role === "recruiter" && (
            <NavLink
              to="/post-job"
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              onClick={() => setMobileMenuOpen(false)}
            >
              Post a Job
            </NavLink>
          )}

          {user ? (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/applications"
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                onClick={() => setMobileMenuOpen(false)}
              >
                {user.role === "recruiter" ? "Applicants" : "My Applications"}
              </NavLink>
              <NavLink
                to="/profile"
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                onClick={() => setMobileMenuOpen(false)}
              >
                Profile
              </NavLink>

              <div className="user-profile-badge">
                <span className="user-role-tag">{user.role}</span>
                <span className="user-name">{user.name}</span>
                <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-secondary btn-sm">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </div>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </nav>

        <button
          className="mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation"
        >
          <span className="hamburger"></span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;
