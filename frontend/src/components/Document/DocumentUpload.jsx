import React, { useState, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert2

const DocumentUpload = ({ vaultId }) => {
  console.log("Received vaultId in DocumentUpload:", vaultId); // ✅ Debugging

  if (!vaultId) {
    console.error("🚨 ERROR: vaultId is missing!");
  }
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null); // Reference to reset file input field

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please select a file before uploading!",
      });
      return;
    }

    if (!vaultId) {
      Swal.fire({
        icon: "error",
        title: "No Vault Found",
        text: "Vault ID is missing. Please try again.",
      });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("file", file);
    formData.append("tags", tags);
    formData.append("vaultId", vaultId);

    try {
      const token = localStorage.getItem("token"); // Get JWT token from local storage

      if (!token) {
        Swal.fire({
          icon: "error",
          title: "Unauthorized",
          text: "You must be logged in to upload documents.",
        });
        return;
      }

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // Attach token ✅
        },
      };

      await axios.post("http://localhost:5000/api/documents", formData, config);

      Swal.fire({
        icon: "success",
        title: "Document uploaded successfully!",
        timer: 1500,
        showConfirmButton: false,
      });

      setTitle("");
      setContent("");
      setFile(null);
      setTags("");

      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset file input field
      }
    } catch (error) {
      console.error("Upload Error:", error.response?.data || error.message);

      if (error.response?.data?.message === "Document limit reached for this vault") {
        Swal.fire({
          icon: "warning",
          title: "Limit Reached",
          text: "You have reached the maximum document limit for this vault!",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Upload Failed",
          text: error.response?.data?.message || "Error uploading document.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      maxWidth: "500px",
      margin: "50px auto",
      padding: "30px",
      background: "#fff",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      borderRadius: "8px",
      textAlign: "center",
    },
    title: {
      color: "#333",
      marginBottom: "20px",
    },
    label: {
      display: "block",
      fontSize: "14px",
      fontWeight: "bold",
      color: "#333",
      textAlign: "left",
      margin: "10px 0 5px",
    },
    input: {
      width: "100%",
      padding: "10px",
      border: "1px solid #ccc",
      borderRadius: "5px",
      fontSize: "14px",
      marginBottom: "15px",
    },
    button: {
      background: loading ? "#aaa" : "#007BFF",
      color: "white",
      fontSize: "16px",
      padding: "10px",
      border: "none",
      borderRadius: "5px",
      cursor: loading ? "not-allowed" : "pointer",
      width: "100%",
      transition: "background 0.3s",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Upload a Document</h2>

      <form onSubmit={handleSubmit}>
        <label style={styles.label}>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={styles.input}
        />

        <label style={styles.label}>Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          style={styles.input}
        ></textarea>

        <label style={styles.label}>File</label>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          required
          style={styles.input}
        />

        <label style={styles.label}>Tags (comma separated)</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          style={styles.input}
        />

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
};

export default DocumentUpload;
