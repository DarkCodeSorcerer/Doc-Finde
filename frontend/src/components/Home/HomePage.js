import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./HomePage.css";

const HomePage = () => {
  const [user, setUser] = useState(null);
  const hasShownPopup = useRef(false); // ✅ Prevent duplicate popups

  // ✅ Show notification popup
  const showNotificationPopup = useCallback((notifications) => {
    if (notifications.length === 0) return;

    const latestNotification = notifications[0];

    Swal.fire({
      title: "Vault Request Update",
      text: latestNotification.message,
      icon: latestNotification.type === "Approved" ? "success" : "info",
      showCancelButton: true,
      confirmButtonText: "Got it",
      cancelButtonText: "Mark as Read",
      confirmButtonColor: "#007bff",
      cancelButtonColor: "#28a745",
    }).then((result) => {
      if (!result.isConfirmed) {
        markNotificationAsRead(latestNotification._id);
      }
    });
  }, []); // ✅ Wrapped inside useCallback

  // ✅ Fetch notifications for the logged-in user
  const fetchNotifications = useCallback(
    async (userId) => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/notifications/user/${userId}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );

        console.log("Fetched Notifications:", response.data); // 🔍 Debugging Line

        // ✅ Prevent duplicate popups
        if (response.data.length > 0 && !hasShownPopup.current) {
          showNotificationPopup(response.data);
          hasShownPopup.current = true; // ✅ Set flag to stop repeated popups
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    },
    [showNotificationPopup] // ✅ Now includes showNotificationPopup
  );

  // ✅ Fetch user & notifications when component mounts
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      fetchNotifications(storedUser._id);
    }
  }, [fetchNotifications]); // ✅ Added fetchNotifications to dependencies

  // ✅ Mark a notification as read
  const markNotificationAsRead = async (notificationId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/notifications/${notificationId}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // ✅ Request Vault
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
        confirmButton: "swal-confirm-btn",
      },
      inputValidator: (value) => {
        if (!value.trim()) {
          return "Vault name is required!";
        }
      },
    });

    if (!vaultName) return;

    let documentLimit;
    const { value } = await Swal.fire({
      title: "Set Document Limit",
      input: "number",
      inputPlaceholder: "Enter a number (1-10)",
      inputAttributes: { min: 1, max: 10 },
      showCancelButton: true,
      customClass: {
        confirmButton: "swal-confirm-btn",
      },
      inputValidator: (value) => {
        if (!value || value < 1 || value > 10) {
          return "Please enter a valid limit (1-10).";
        }
      },
    });

    if (value) {
      documentLimit = value;
    }

    if (!documentLimit) return;

    try {
      const response = await axios.post(
        "http://localhost:5000/api/vaults/request",
        {
          userId: user._id,
          vaultName,
          documentLimit,
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
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong!",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div className="homepage">
      <h2>Welcome to DocFind!</h2>

      <div>
        <button className="vault-button" onClick={requestVault}>
          Request a Vault
        </button>
      </div>
    </div>
  );
};

export default HomePage;
