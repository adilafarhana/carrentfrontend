import React from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";

const availableLocations = ["Kozhikode", "Koyilandy", "Vadakara", "Malappuram", "Palakkad", "Ernakulam"]; // Standardized locations

const NavHome = () => {
  return (
    <nav style={styles.navbar}>
      {/* Logo and Brand Name */}
      <div style={styles.brandContainer}>
        <img
          src="https://static.vecteezy.com/system/resources/previews/000/623/239/original/auto-car-logo-template-vector-icon.jpg"
          alt="Car Logo"
          style={styles.logo}
        />
        <h2 style={styles.brandName}>Car Marketplace</h2>
      </div>

      {/* Available Locations */}
    
     
      {/* Navigation Links */}
      <ul style={styles.navLinks}>
        <li style={styles.navItem}>
          <Link to="/rendcardashboard" style={styles.navLink}>
            Used Car
          </Link>
        </li>
        <li style={styles.navItem}>
          <Link to="/usedcardashboard" style={styles.navLink}>
            Rent Car
          </Link>
        </li>
        <li style={styles.navItem}>
          <Link to="/userdetails" style={styles.navLink}>
            User Details
          </Link>
        </li>
        <li style={styles.navItem}>
          <Link to="/Usedcarblog" style={styles.navLink}>
            Blogs
          </Link>
       
        </li>
        
      </ul>
      <div style={styles.locationContainer}>
        <FaMapMarkerAlt style={styles.locationIcon} />
        <span style={styles.locationText}>
          <strong> Available Locations:</strong> {availableLocations.join(", ")}
        </span>
      </div>
      {/* Login Button */}
     
    </nav>
  );
};

// CSS-in-JS Styling
const styles = {
  navbar: {
    backgroundColor: "#222",
    padding: "12px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
    flexWrap: "wrap",
    gap: "20px", // Added gap for better spacing
  },
  brandContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  logo: {
    width: "60px",
    height: "auto",
  },
  brandName: {
    color: "white",
    fontSize: "22px",
    fontWeight: "bold",
    margin: 0, // Remove default margin
  },
  locationContainer: {
    display: "flex",
    alignItems: "center",
    color: "white",
    fontSize: "16px",
    fontWeight: "500",
    flex: 1, // Allow location container to take available space
    margin: "0 20px", // Add margin for spacing
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
    gap: "15px",
    flexWrap: "wrap", // Allow wrapping for smaller screens
  },
  navItem: {
    margin: "0 10px",
  },
  navLink: {
    color: "white",
    textDecoration: "none",
    fontSize: "16px",
    padding: "8px 12px",
    borderRadius: "4px",
    transition: "background-color 0.3s ease",
    fontWeight: "500",
    "&:hover": {
      backgroundColor: "#444", // Hover effect
    },
  },
  navButton: {
    backgroundColor: "#007bff",
    color: "white",
    textDecoration: "none",
    fontSize: "16px",
    padding: "8px 12px",
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    transition: "background-color 0.3s ease",
    "&:hover": {
      backgroundColor: "#0056b3", // Hover effect
    },
  },
  loginIcon: {
    width: "18px",
    height: "18px",
    marginRight: "6px",
  },
};

export default NavHome;