import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const UserVaultDashboard = () => {
  const [vaults, setVaults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  useEffect(() => {
    if (user?._id) {
      axios
        .get(`http://localhost:5000/api/vaults/user/${user._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          setVaults(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching vaults:", error);
          setLoading(false);
        });
    }
  }, [user]);

  const requestVault = async () => {
    if (!user || !user._id) {
      Swal.fire("Error", "User is not logged in", "error");
      return;
    }
  
    const { value: vaultName } = await Swal.fire({
      title: "Request a Vault",
      input: "text",
      inputPlaceholder: "Enter Vault Name",
      showCancelButton: true,
      confirmButtonText: "Next",
      customClass: {
        confirmButton: "swal-confirm-btn", // ✅ This applies your custom button styling
      },
      inputValidator: (value) => {
        if (!value.trim()) {
          return "Vault name is required!";
        }
      },
    });
  
    if (!vaultName) return;
  
    // Correctly handle 'documentLimit'
    let documentLimit;
    const { value } = await Swal.fire({
      title: "Set Document Limit",
      input: "number",
      inputPlaceholder: "Enter a number (1-10)",
      inputAttributes: { min: 1, max: 10 },
      showCancelButton: true,
      confirmButtonText: "Submit",
      customClass: {
        confirmButton: "swal-confirm-btn", // ✅ This applies your custom button styling
      },
      inputValidator: (value) => {
        if (!value || value < 1 || value > 10) {
          return "Please enter a valid limit (1-10).";
        }
      },
    });
  
    // If a value was entered, assign it to 'documentLimit'
    if (value) {
      documentLimit = value;
    }
  
    // Check if documentLimit is still undefined
    if (!documentLimit) return;
  
    try {
      const response = await axios.post(
        "http://localhost:5000/api/vaults/request",
        {
          userId: user._id,
          vaultName,
          documentLimit, // Correctly sending the document limit
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
  
      Swal.fire({
              icon: "success",
              title: response.data.message,
              showConfirmButton: false,
              timer: 1500,
            });
    } catch (error) {
      Swal.fire("Error", error.response?.data?.error || "Something went wrong!", "error");
    }
  };

  const handleViewVault = (vaultId) => {
    localStorage.setItem("selectedVaultId", vaultId);
    navigate(`/vault/${vaultId}`);
  };

  return (
    <div style={styles.container}>
      <h2>My Vault</h2>
      {loading ? (
        <p>Loading...</p>
      ) : vaults.length === 0 ? (
        <button onClick={requestVault} style={styles.requestButton}>
          Request a Vault
        </button>
      ) : (
        <div style={styles.vaultGrid}>
          {vaults.map((vault, index) => (
            <div key={index} style={styles.vaultItem}>
              <h3>{vault.vaultName}</h3>
              <p>Status: <strong>{vault.status}</strong></p>
              <p>Capacity: {vault.documentLimit} Files</p>

              {vault.status === "Active" && (
                <button onClick={() => handleViewVault(vault._id)} style={styles.viewButton}>
                  View Vault
                </button>
              )}

              {vault.status === "Denied" && <p>Reason: {vault.reason}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: "20px", textAlign: "center" },
  requestButton: {
    padding: "12px 25px",
    background: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
  vaultGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    justifyContent: "center",
    marginTop: "20px",
  },
  vaultItem: {
    background: "#f8f9fa",
    padding: "15px",
    borderRadius: "8px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  viewButton: {
    padding: "10px 20px",
    background: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    marginTop: "10px",
  },
};

export default UserVaultDashboard;
