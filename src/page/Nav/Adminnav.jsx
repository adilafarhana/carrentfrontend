import React from "react";
import { Link } from "react-router-dom";

const Nav = () => {
  return (
    <nav style={styles.navbar}>
      {/* Brand Name Only (No Car Logo) */}
      <h2 style={styles.brandName}>Car Marketplace</h2>

      {/* Navigation Links */}
      <ul style={styles.navLinks}>
        <li style={styles.navItem}>
          <Link 
            to="/uploadcar" 
            style={styles.navLink} 
            onMouseOver={(e) => (e.target.style.backgroundColor = "#575757")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "transparent")}
          >
            Upload cars

          </Link>
        </li>

        <li style={styles.navItem}>
          <Link to="/signin" style={styles.navButton}>
            <img 
              src="https://cdn-icons-png.flaticon.com/512/747/747376.png" 
              alt="Login Icon" 
              style={styles.loginIcon} 
            />
            Login
          </Link>
        </li>
      </ul>
    </nav>
  );
};

// **CSS-in-JS Styling**
const styles = {
  navbar: {
    backgroundColor: "#333",
    padding: "12px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
  },
  brandName: {
    color: "white",
    fontSize: "22px",
    fontWeight: "bold",
  },
  navLinks: {
    listStyleType: "none",
    margin: 0,
    padding: 0,
    display: "flex",
    alignItems: "center",
  },
  navItem: {
    margin: "0 15px",
  },
  navLink: {
    color: "white",
    textDecoration: "none",
    fontSize: "18px",
    padding: "10px 15px",
    borderRadius: "5px",
    transition: "background-color 0.3s ease",
  },
  navButton: {
    backgroundColor: "#007bff",
    color: "white",
    textDecoration: "none",
    fontSize: "18px",
    padding: "10px 15px",
    borderRadius: "5px",
    transition: "background-color 0.3s ease",
    display: "flex",
    alignItems: "center",
  },
  loginIcon: {
    width: "20px",
    height: "20px",
    marginRight: "8px",
  },
};

export default Nav;
