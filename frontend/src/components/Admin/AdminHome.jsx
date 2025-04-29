import React, { useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const AdminHome = () => {
  const navigate = useNavigate();
  const hasShownPopup = useRef(false); // ✅ Prevent duplicate popups

  const showNotificationPopup = useCallback((notifications) => {
    const latestNotification = notifications[0];

    // Ensure user details exist
    const userName = latestNotification.user?.name || "Unknown User";
    const userEmail = latestNotification.user?.email || "No Email";
    const vaultName = latestNotification.vaultName || "Unknown Vault";

    Swal.fire({
      title: "New Vault Request",
      text: `${userName} (${userEmail}) has requested a vault named "${vaultName}".`,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "View",
      cancelButtonText: "Mark as Read",
      confirmButtonColor: "#007bff",
      cancelButtonColor: "#28a745",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/admin/vault-requests");
      } else {
        markNotificationAsRead(latestNotification._id);
      }
    });
  }, [navigate]); // ✅ Dependencies added here

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/notifications/admin", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      // ✅ Prevent duplicate popups
      if (response.data.length > 0 && !hasShownPopup.current) {
        showNotificationPopup(response.data);
        hasShownPopup.current = true; // ✅ Set flag to stop repeated popups
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }, [showNotificationPopup]); // ✅ Now includes showNotificationPopup

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.isAdmin) {
      navigate("/"); // Redirect non-admin users to homepage
    } else {
      fetchNotifications();
    }
  }, [navigate, fetchNotifications]); // ✅ Added fetchNotifications to dependencies

  const markNotificationAsRead = async (notificationId) => {
    try {
      await axios.put(`http://localhost:5000/api/notifications/${notificationId}/read`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <div
      style={{
        backgroundImage:
          "url('https://www.protechguy.com/wp-content/uploads/sites/712/2021/01/bigstock-Closed-Padlock-On-Digital-Back-383628656-scaled.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <h1>Welcome, Admin!</h1>
      <p>This is the admin dashboard.</p>
    </div>
  );
};

export default AdminHome;
