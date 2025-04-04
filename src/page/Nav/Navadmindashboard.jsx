import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navadmindashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Styles
  const styles = {
    navbar: {
      backgroundColor: "#2c3e50",
      padding: "0 20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      zIndex: 1000,
      height: "70px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    },
    navContainer: {
      display: "flex",
      alignItems: "center",
      width: "100%",
      maxWidth: "1200px",
      margin: "0 auto",
    },
    logo: {
      height: "50px",
      width: "auto",
      marginRight: "30px",
      borderRadius: "5px",
    },
    navLinks: {
      display: "flex",
      alignItems: "center",
      flexGrow: 1,
    },
    linkList: {
      listStyleType: "none",
      margin: 0,
      padding: 0,
      display: "flex",
    },
    linkItem: {
      margin: "0 8px",
    },
    link: {
      color: "#ecf0f1",
      textDecoration: "none",
      fontSize: "16px",
      padding: "10px 15px",
      borderRadius: "4px",
      transition: "all 0.3s ease",
      display: "inline-block",
      fontWeight: "500",
    },
    linkHover: {
      backgroundColor: "#34495e",
      transform: "translateY(-2px)",
    },
    activeLink: {
      backgroundColor: "#3498db",
    },
    logoutButton: {
      backgroundColor: "#e74c3c",
      color: "white",
      border: "none",
      padding: "10px 15px",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "500",
      transition: "all 0.3s ease",
      marginLeft: "20px",
    },
    logoutButtonHover: {
      backgroundColor: "#c0392b",
      transform: "translateY(-2px)",
    },
     brandName: {
    color: "white",
    fontSize: "22px",
    fontWeight: "bold",
  },
  };

  // Helper function for hover effects
  const handleMouseOver = (e) => {
    e.target.style.backgroundColor = styles.linkHover.backgroundColor;
    e.target.style.transform = styles.linkHover.transform;
  };

  const handleMouseOut = (e) => {
    e.target.style.backgroundColor = "";
    e.target.style.transform = "";
  };

  const handleLogoutMouseOver = (e) => {
    e.target.style.backgroundColor = styles.logoutButtonHover.backgroundColor;
    e.target.style.transform = styles.logoutButtonHover.transform;
  };

  const handleLogoutMouseOut = (e) => {
    e.target.style.backgroundColor = styles.logoutButton.backgroundColor;
    e.target.style.transform = "";
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.navContainer}>
        {/* Logo */}
        <img
          src="https://static.vecteezy.com/system/resources/previews/000/623/239/original/auto-car-logo-template-vector-icon.jpg"
          alt="Car Logo"
          style={styles.logo}
        />
              <h2 style={styles.brandName}>Car Marketplace</h2>


        {/* Navigation Links */}
        <div style={styles.navLinks}>
          <ul style={styles.linkList}>
            <li style={styles.linkItem}>
              <Link
                to="/signin"
                style={styles.link}
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
              >
                Home
              </Link>
            </li>
            <li style={styles.linkItem}>
              <Link
                to="/admin"
                style={styles.link}
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
              >
                Admin Dashboard
              </Link>
            </li>
            <li style={styles.linkItem}>
              <Link
                to="/uploadcar"
                style={styles.link}
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
              >
                Upload Cars
              </Link>
            </li>
            <li style={styles.linkItem}>
              <Link
                to="/Adminbookingdetails"
                style={styles.link}
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
              >
                Bookings
              </Link>
            </li>
            <li style={styles.linkItem}>
              <Link
                to="/Predict"
                style={styles.link}
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
              >
                Predict
              </Link>
            </li>
            <li style={styles.linkItem}>
              <Link
                to="/AdminFAQ"
                style={styles.link}
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
              >
                FAQs
              </Link>
            </li>
            <li style={styles.linkItem}>
              <Link
                to="/Admincomplaints"
                style={styles.link}
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
              >
                Complaints
              </Link>
            </li>
            <li style={styles.linkItem}>
              <Link
                to="/bloglist"
                style={styles.link}
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
              >
                Blog
              </Link>
            </li>
            <li style={styles.linkItem}>
              <Link
                to="/viewusers"
                style={styles.link}
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
              >
                Users
              </Link>
            </li>
          </ul>

          {/* Logout Button */}
          {localStorage.getItem("token") && (
            <button
              style={styles.logoutButton}
              onClick={handleLogout}
              onMouseOver={handleLogoutMouseOver}
              onMouseOut={handleLogoutMouseOut}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navadmindashboard;