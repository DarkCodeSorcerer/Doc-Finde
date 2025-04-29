import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert2

const Register = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    isAdmin: false, // Default to false
    profilePic: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Convert checkbox values to Boolean
    const newValue = type === "checkbox" ? checked : value;

    // Mobile Number: Block letters and ensure only numbers can be typed
    if (name === "mobile") {
      if (!/^\d*$/.test(value)) return; // Blocks letters completely
    }

    setUserData({ ...userData, [name]: newValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ❌ Validate Name (should not be numbers only)
    if (/^\d+$/.test(userData.name)) {
      Swal.fire("Error!", "Username can't be only numbers.", "error");
      return;
    }

    // ❌ Validate Email Format
    if (!userData.email.includes("@")) {
      Swal.fire("Error!", "Invalid email format!", "error");
      return;
    }

    // ❌ Validate Mobile Number (exactly 10 digits)
    if (!/^\d{10}$/.test(userData.mobile)) {
      Swal.fire("Error!", "Mobile number must be exactly 10 digits!", "error");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/users/register", userData);
      
      Swal.fire({
        title: "Success!",
        text: "User registered successfully! Redirecting to login...",
        icon: "success",
        timer: 1500, 
        showConfirmButton: false,
      });

      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      Swal.fire("Error!", "Registration failed! Please try again.", "error");
    }
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
    checkboxLabel: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
      marginBottom: "15px",
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
    message: {
      marginBottom: "10px",
      fontSize: "14px",
    },
    errorMessage: {
      marginBottom: "10px",
      fontSize: "14px",
      color: "red",
    },
    link: {
      color: "#007BFF",
      textDecoration: "none",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Register</h2>

      <form onSubmit={handleSubmit}>
        <div style={styles.inputWrapper}>
          <input type="text" name="name" placeholder="Name" onChange={handleChange} required style={styles.input} />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required style={styles.input} />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required style={styles.input} />
          <input type="text" name="mobile" placeholder="Mobile Number" value={userData.mobile} onChange={(e) => setUserData({ ...userData, mobile: e.target.value.replace(/\D/g, "") })} required style={styles.input} maxLength="10" />
          <input type="text" name="profilePic" placeholder="Profile Picture URL (optional)" onChange={handleChange} style={styles.input} />
          <label style={styles.checkboxLabel}>
            <input type="checkbox" name="isAdmin" onChange={handleChange} /> Register as Admin
          </label>
        </div>
        <button type="submit" style={styles.button}>Register</button>
      </form>

      <p>
        Already have an account?{" "}
        <Link to="/login" style={styles.link}>Login Here</Link>
      </p>
    </div>
  );
};

export default Register;
