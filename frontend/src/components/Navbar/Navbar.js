import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <Link to="/">
        <img src="/DocFinde.png" alt="DocFinde Logo" className="navbar-logo" />
      </Link>

      <ul className="nav-list">
        {user && <li><Link to="/" className="nav-link">Home</Link></li>}
        {user && (
          <>
            <li><Link to="/vault" className="nav-link">My Vault</Link></li>
          </>
        )}
        {user ? (
          <>
            <li className="welcome-container">
              <span className="welcome-text">Welcome, {user.name} !</span>
            </li>
            <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
          </>
        ) : (
          <>
            <li><Link to="/login" className="nav-link">Login</Link></li>
            <li><Link to="/register" className="nav-link">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
