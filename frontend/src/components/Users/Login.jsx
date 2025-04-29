import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert2

const Login = ({ setIsAuthenticated }) => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [message, setMessage] = useState(""); // To store success/error messages
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages
  
    axios
      .post("http://localhost:5000/api/users/login", credentials)
      .then((response) => {
        console.log("Login Response:", response.data); // Debugging log
  
        setMessage("Login successful!");
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
  
        // Redirect immediately based on admin status
        if (response.data.user.isAdmin) {
          navigate("/admin"); // Redirect admin users
        } else {
          navigate("/"); // Redirect normal users
        }
  
        // Update authentication state (after navigation)
        setIsAuthenticated(true);

        // Show SweetAlert2 success notification and auto-close after 1.5 seconds
        Swal.fire({
          title: "Login successful!",
          text: "Welcome to DocFind!",
          icon: "success",
          timer: 1500, // Auto-close after 1.5 seconds
          showConfirmButton: false, // Hide the OK button
        });
      })
      .catch((error) => {
        setMessage("Login failed! Check your credentials.");

        // Show SweetAlert2 error notification and auto-close after 1.5 seconds
        Swal.fire({
          title: "Error!",
          text: "Login failed! Check your credentials.",
          icon: "error",
          timer: 1500, // Auto-close after 1.5 seconds
          showConfirmButton: false, // Hide the OK button
        });
      });
  };

  const styles = {
    container: {
      maxWidth: "400px",
      margin: "50px auto",
      padding: "20px",
      backgroundColor: "#f9f9f9",
      borderRadius: "8px",
      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
      textAlign: "center",
    },
    heading: {
      color: "#333",
      marginBottom: "20px",
    },
    inputWrapper: {
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
      marginBottom: "15px",
    },
    input: {
      padding: "10px",
      marginBottom: "10px",
      borderRadius: "4px",
      border: "1px solid #ccc",
      fontSize: "16px",
      boxSizing: "border-box",
    },
    button: {
      width: "100%",
      padding: "10px",
      backgroundColor: "#007BFF",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      transition: "background 0.3s",
    },
    buttonHover: {
      backgroundColor: "#0056b3",
    },
    message: {
      marginBottom: "10px",
      fontSize: "14px",
      color: "#e74c3c", // Red for error messages
    },
    link: {
      color: "#007BFF",
      textDecoration: "none",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Login</h2>
      {message && <p style={styles.message}>{message}</p>} {/* Show notifications */}
      <form onSubmit={handleSubmit}>
        <div style={styles.inputWrapper}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button}>Login</button>
      </form>
      <p>
        New to DocFind?{" "}
        <Link to="/register" style={styles.link}>Register Here</Link>
      </p>
    </div>
  );
};

export default Login;
