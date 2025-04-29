import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Navbar/Navbar.css"; // Using the same CSS as the user Navbar

const AdminNavbar = () => {
  const admin = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <Link to="/admin">
        <img src="/DocFinde.png" alt="DocFinde Logo" className="navbar-logo" />
      </Link>

      <ul className="nav-list">
        {admin && <li><Link to="/admin" className="nav-link">Dashboard</Link></li>}
        {admin && (
          <>
            <li><Link to="/admin/users" className="nav-link">Manage Users</Link></li>
            <li><Link to="/admin/vault-requests" className="nav-link">Vault Requests</Link></li>
          </>
        )}
        {admin ? (
          <>
            <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
          </>
        ) : (
          <li><Link to="/login" className="nav-link">Login</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default AdminNavbar;
