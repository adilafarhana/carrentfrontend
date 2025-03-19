import React from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa"; // Location icon

const availableLocations = ["Kozhikode", "Koyilandy", "Vadakara", "Malappuram", "Palakkad","Eranakulam"]; // Standardized locations

const Nav = () => {
  return (
    <nav style={styles.navbar}>
      {/* Brand Name */}
      <h2 style={styles.brandName}>Car Marketplace</h2>

      {/* Available Locations Display */}
      <div style={styles.locationContainer}>
        <FaMapMarkerAlt style={styles.locationIcon} />
        <span style={styles.locationText}>
          <strong>Available Locations:</strong> {availableLocations.join(", ")}
        </span>
      </div>

      {/* Navigation Links */}
      <ul style={styles.navLinks}>
       
        <li style={styles.navItem}>
          <Link to="/Aboutas" style={styles.navLink}>About Us</Link>
        </li>
        <li style={styles.navItem}>
          <Link to="/Contact" style={styles.navLink}>Contact</Link>
        </li>

        {/* Login Button with Icon */}
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
    backgroundColor: "#222",
    padding: "12px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
    flexWrap: "wrap",
  },
  brandName: {
    color: "white",
    fontSize: "22px",
    fontWeight: "bold",
  },
  locationContainer: {
    display: "flex",
    alignItems: "center",
    color: "white",
    fontSize: "16px",
    fontWeight: "500",
  },
  locationIcon: {
    color: "#f39c12",
    fontSize: "18px",
    marginRight: "6px",
  },
  locationText: {
    color: "white",
  },
  navLinks: {
    listStyleType: "none",
    margin: 0,
    padding: 0,
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  navItem: {
    margin: "0 10px",
  },
  navLink: {
    color: "white",
    textDecoration: "none",
    fontSize: "18px",
    padding: "8px 12px",
    borderRadius: "4px",
    transition: "background-color 0.3s ease",
    fontWeight: "500",
  },
  navButton: {
    backgroundColor: "#007bff",
    color: "white",
    textDecoration: "none",
    fontSize: "18px",
    padding: "8px 12px",
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    transition: "background-color 0.3s ease",
  },
  loginIcon: {
    width: "18px",
    height: "18px",
    marginRight: "6px",
  },
};

export default Nav;
