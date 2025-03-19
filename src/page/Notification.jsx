import React, { useEffect, useState } from "react";
import axios from "axios";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get("https://carrentbackend-1-tpmm.onrender.com/getnotication", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="notifications">
      <h3>Latest Notifications</h3>
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <div key={notification._id} className="notification">
            <p>{notification.message}</p>
            <p><small>{new Date(notification.createdAt).toLocaleString()}</small></p>
          </div>
        ))
      ) : (
        <p>No new notifications.</p>
      )}
    </div>
  );
};

export default Notification;
