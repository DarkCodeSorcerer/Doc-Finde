import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch Users from Backend
  const fetchUsers = () => {
    axios
      .get("http://localhost:5000/api/users")
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error fetching users:", error));
  };

  // Delete User with SweetAlert2 (No "OK" button)
  const deleteUser = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:5000/api/users/${id}`)
          .then(() => {
            Swal.fire({
              title: "Deleted!",
              text: "User has been deleted.",
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
            });
            fetchUsers(); // Refresh user list
          })
          .catch((error) => console.error("Error deleting user:", error));
      }
    });
  };

  // Toggle User Role with SweetAlert2 (No "OK" button)
  const toggleUserRole = (id, isAdmin) => {
    const action = isAdmin ? "demote this user?" : "promote this user to admin?";

    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to ${action}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: isAdmin ? "Yes, Demote!" : "Yes, Promote!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .put(`http://localhost:5000/api/users/${id}`, { isAdmin: !isAdmin })
          .then(() => {
            Swal.fire({
              title: "Updated!",
              text: `User has been ${isAdmin ? "demoted" : "promoted"} successfully.`,
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
            });
            fetchUsers(); // Refresh user list
          })
          .catch((error) => console.error("Error updating user role:", error));
      }
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>User Management</h2>
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "white",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <thead>
            <tr>
              <th style={tableHeaderStyle}>Name</th>
              <th style={tableHeaderStyle}>Email</th>
              <th style={tableHeaderStyle}>Mobile</th>
              <th style={tableHeaderStyle}>Role</th>
              <th style={tableHeaderStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={tableCellStyle}>{user.name}</td>
                <td style={tableCellStyle}>{user.email}</td>
                <td style={tableCellStyle}>{user.mobile}</td>
                <td style={tableCellStyle}>{user.isAdmin ? "Admin" : "User"}</td>
                <td style={tableCellStyle}>
                  <button
                    style={user.isAdmin ? editBtnStyle : promoteBtnStyle}
                    onClick={() => toggleUserRole(user._id, user.isAdmin)}
                  >
                    {user.isAdmin ? "Demote to User" : "Promote to Admin"}
                  </button>
                  <button
                    style={deleteBtnStyle}
                    onClick={() => deleteUser(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Inline Styles
const tableHeaderStyle = {
  padding: "10px",
  textAlign: "left",
  backgroundColor: "#f4f4f4",
};

const tableCellStyle = {
  padding: "10px",
  textAlign: "left",
};

const deleteBtnStyle = {
  backgroundColor: "#d33",
  color: "white",
  border: "none",
  padding: "8px 12px",
  cursor: "pointer",
  marginLeft: "5px",
  borderRadius: "4px",
};

const editBtnStyle = {
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  padding: "8px 12px",
  cursor: "pointer",
  borderRadius: "4px",
};

const promoteBtnStyle = {
  backgroundColor: "#28a745",
  color: "white",
  border: "none",
  padding: "8px 12px",
  cursor: "pointer",
  borderRadius: "4px",
};

export default AdminUserManagement;
