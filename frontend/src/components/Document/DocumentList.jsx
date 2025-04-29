import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const DocumentList = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newTags, setNewTags] = useState("");

  useEffect(() => {
    const vaultId = localStorage.getItem("selectedVaultId");

    if (!vaultId) {
      setLoading(false);
      return;
    }

    fetchDocuments(vaultId);
  }, []);

  const fetchDocuments = async (vaultId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axios.get(`http://localhost:5000/api/documents/vault/${vaultId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDocuments(response.data);
    } catch (error) {
      console.error("Error fetching documents:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (fileUrl) => {
    if (!fileUrl) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "File URL is missing",
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(fileUrl, {
        responseType: "blob",
        headers: { Authorization: `Bearer ${token}` },
      });

      const blob = new Blob([response.data]);
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileUrl.split("/").pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading the file:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to download the file",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "This document will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!confirmDelete.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      const vaultId = localStorage.getItem("selectedVaultId");

      await axios.delete(`http://localhost:5000/api/documents/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDocuments((prevDocs) => prevDocs.filter((doc) => doc._id !== id));

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Document has been deleted",
        timer: 1500,
        showConfirmButton: false,
      });

      if (vaultId) {
        await axios.put(
          `http://localhost:5000/api/vaults/${vaultId}/remove-document`,
          { documentId: id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const handleEditClick = async (doc) => {
    const { value: formValues } = await Swal.fire({
      title: "Edit Document",
      html: `
        <input id="swal-title" class="swal2-input" value="${doc.title}" placeholder="Enter new title">
        <input id="swal-tags" class="swal2-input" value="${doc.tags ? doc.tags.join(", ") : ""}" placeholder="Enter tags (comma separated)">
      `,
      focusConfirm: false,
      showCancelButton: true,
      customClass: {
        confirmButton: "swal-confirm-btn",
      },
      confirmButtonText: "Update",
      cancelButtonText: "Cancel",
      preConfirm: () => {
        return {
          title: document.getElementById("swal-title").value.trim(),
          tags: document.getElementById("swal-tags").value.trim(),
        };
      }
    });
  
    if (!formValues) return;
  
    const updatedData = {
      title: formValues.title,
      tags: formValues.tags.split(",").map((tag) => tag.trim()),
    };
  
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/documents/${doc._id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      fetchDocuments(localStorage.getItem("selectedVaultId"));
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Document details updated successfully",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error updating document:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update document",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };  

  const handleUpdateDocument = async () => {
    if (!selectedDoc) return;

    const updatedData = {
      title: newTitle,
      tags: newTags.split(",").map((tag) => tag.trim()),
    };

    try {
      const token = localStorage.getItem("token");

      await axios.put(`http://localhost:5000/api/documents/${selectedDoc._id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchDocuments(localStorage.getItem("selectedVaultId"));
      setSelectedDoc(null);
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Document details updated successfully",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error updating document:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update document",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div className="document-container" style={{ padding: "20px", maxWidth: "900px", margin: "auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Uploaded Documents</h2>

      {loading ? (
        <p>Loading...</p>
      ) : documents.length === 0 ? (
        <p>No documents found.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ddd", borderRadius: "8px", overflow: "hidden" }}>
          <thead>
            <tr style={{ backgroundColor: "#343a40", color: "white" }}>
              <th style={{ padding: "12px" }}>Title</th>
              <th style={{ padding: "12px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => {
              const fileUrl = doc.fileUrl
                ? doc.fileUrl.startsWith("/uploads/")
                  ? `http://localhost:5000${doc.fileUrl}`
                  : doc.fileUrl
                : null;

              return (
                <tr key={doc._id} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={{ padding: "10px" }}>{doc.title}</td>
                  <td style={{ padding: "10px" }}>
                  {fileUrl && (
                  <button onClick={() => window.open(fileUrl, "_blank")} style={{ marginRight: "10px", padding: "6px 12px", backgroundColor: "#000", color: "white", border: "none", cursor: "pointer",borderRadius: "5px" }}>
                      View File
                    </button>)}
                    <button onClick={() => handleDownload(fileUrl)} style={{ marginRight: "10px", padding: "6px 12px", backgroundColor: "#28a745", color: "white", border: "none", cursor: "pointer", borderRadius: "5px" }}>
                      Download
                    </button>
                    <button onClick={() => handleDelete(doc._id)} style={{ marginRight: "10px", padding: "6px 12px", backgroundColor: "#dc3545", color: "white", border: "none", cursor: "pointer", borderRadius: "5px" }}>
                      Delete
                    </button>
                    <button onClick={() => handleEditClick(doc)} style={{ padding: "6px 12px", backgroundColor: "#007bff", color: "white", border: "none", cursor: "pointer", borderRadius: "5px" }}>
                      Edit
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {selectedDoc && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Document</h3>
            <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
            <input type="text" value={newTags} onChange={(e) => setNewTags(e.target.value)} />
            <button onClick={handleUpdateDocument}>Save</button>
            <button onClick={() => setSelectedDoc(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentList;
