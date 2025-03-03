import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navrent from "../Nav/Navrent";

const UserDetails = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const requestHeader = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };

  const userprofile = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3030/userprofile",
        requestHeader
      );
      console.log("API Response:", response.data);
      setUser(response.data.user);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch user details");
      setLoading(false);
    }
  };

  useEffect(() => {
    userprofile();
  }, []);

  if (loading)
    return <div style={styles.loader}>Loading user details...</div>;
  if (error) return <div style={styles.error}>{error}</div>;

  return (
    <div style={styles.pageStyle}>
      <Navrent />
      <div style={styles.profileContainer}>
        <div style={styles.profileCard}>
          <div style={styles.avatarContainer}>
            <img
              src="https://tse1.mm.bing.net/th?id=OIP.GHGGLYe7gDfZUzF_tElxiQHaHa&pid=Api&P=0&h=180"
              alt="User Avatar"
              style={styles.avatar}
            />
          </div>
          <h2 style={styles.userName}>{user?.name || "N/A"}</h2>
          <p style={styles.userInfo}>
            <strong>Email: </strong> {user?.email || "N/A"}
          </p>
          <p style={styles.userInfo}>
            <strong>Phone: </strong> {user?.phone || "N/A"}
          </p>
          <p style={styles.userInfo}>
            <strong>Gender: </strong> {user?.gender || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageStyle: {
    height: "100vh",
    width: "100vw",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "#EFDFD8",
  },
  profileContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1, // Pushes content below navbar
    width: "100%",
  },
  profileCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "30px",
    width: "350px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
  },
  avatarContainer: {
    marginBottom: "20px",
  },
  avatar: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "4px solid #ddd",
  },
  userInfo: {
    textAlign: "center",
    color: "#333",
    fontSize: "16px",
    margin: "5px 0",
  },
  userName: {
    fontSize: "24px",
    color: "#222",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  loader: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    fontWeight: "bold",
    color: "white",
  },
  error: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    color: "red",
    fontWeight: "bold",
  },
};

export default UserDetails;
