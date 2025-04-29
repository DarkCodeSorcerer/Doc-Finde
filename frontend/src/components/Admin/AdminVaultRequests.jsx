import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AdminVaultRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/vaults/requests/all")
      .then((response) => setRequests(response.data))
      .catch((error) => console.error("Error fetching requests:", error));
  }, []);

  const handleApprove = (vaultId) => {
    axios.put(`http://localhost:5000/api/vaults/${vaultId}/approve`)
      .then(() => {
        Swal.fire({
          title: "Approved!",
          text: "The vault request has been approved.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false
        });
        setRequests(requests.filter((req) => req._id !== vaultId));
      })
      .catch(() => {
        Swal.fire({
          title: "Error",
          text: "Could not approve the vault request.",
          icon: "error",
          timer: 1500,
          showConfirmButton: false
        });
      });
  };

  const handleDeny = (vaultId) => {
    Swal.fire({
      title: "Deny Vault Request",
      input: "text",
      inputLabel: "Provide a reason for denial",
      showCancelButton: true,
      confirmButtonText: "Deny",
    }).then((result) => {
      if (result.isConfirmed) {
        axios.put(`http://localhost:5000/api/vaults/${vaultId}/deny`, { reason: result.value })
          .then(() => {
            Swal.fire({
              title: "Denied!",
              text: "The request has been denied.",
              icon: "success",
              timer: 1500,
              showConfirmButton: false
            });
            setRequests(requests.filter((req) => req._id !== vaultId));
          })
          .catch(() => {
            Swal.fire({
              title: "Error",
              text: "Could not deny the vault request.",
              icon: "error",
              timer: 1500,
              showConfirmButton: false
            });
          });
      }
    });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Vault Requests</h2>
      {requests.length === 0 ? (
        <p style={styles.noRequests}>No pending requests</p>
      ) : (
        <div style={styles.gridContainer}>
          {requests.map((req) => (
            <div key={req._id} style={styles.card}>
              <h3 style={styles.vaultName}>{req.vaultName}</h3>
              <p style={styles.userDetails}>
                Requested by: <strong>{req.user?.name || "Unknown User"}</strong> <br />
                Email: <strong>{req.user?.email || "No Email"}</strong> <br />
                Document Limit: <strong>{req.documentLimit}</strong>
              </p>
              <div style={styles.buttonGroup}>
                <button onClick={() => handleApprove(req._id)} style={styles.approveButton}>Approve</button>
                <button onClick={() => handleDeny(req._id)} style={styles.denyButton}>Deny</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    textAlign: "center",
  },
  heading: {
    fontSize: "24px",
    marginBottom: "20px",
  },
  noRequests: {
    fontSize: "18px",
    color: "#888",
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    maxWidth: "900px",
    margin: "auto",
    gap: "20px",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    textAlign: "left",
  },
  vaultName: {
    fontSize: "20px",
    marginBottom: "10px",
    color: "#333",
  },
  userDetails: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "15px",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
  },
  approveButton: {
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    padding: "8px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "0.3s ease-in-out",
  },
  denyButton: {
    backgroundColor: "#D32F2F",
    color: "white",
    border: "none",
    padding: "8px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "0.3s ease-in-out",
  },
};

export default AdminVaultRequests;
