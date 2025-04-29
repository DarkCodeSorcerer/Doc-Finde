import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import ManageDocuments from "../Document/DocumentList"; // Assuming you have this component

const VaultDetails = () => {
  const navigate = useNavigate();
  const { vaultId } = useParams(); // Get the vaultId from the URL

  const handleUploadRedirect = () => {
    navigate(`/vault/${vaultId}/upload-document`); // Redirect to the upload page
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Welcome to your Vault!</h2>

      {/* Uploaded Documents Section */}
      <div style={styles.buttonContainer}>
        <ManageDocuments />
      </div>

      {/* Upload a New Document Button */}
      <div style={styles.buttonContainer}>
        <button style={styles.uploadButton} onClick={handleUploadRedirect}>
          Upload a New Document
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    textAlign: "center",
    maxWidth: "900px",
    margin: "0 auto",
    fontFamily: "'Roboto', sans-serif",
  },
  header: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "20px",
  },
  buttonContainer: {
    margin: "20px 0",
  },
  uploadButton: {
    padding: "10px 20px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontSize: "1rem",
    borderRadius: "5px",
  },
};

export default VaultDetails;
