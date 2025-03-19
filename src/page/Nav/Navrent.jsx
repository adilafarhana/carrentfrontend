import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa"; // Import location icon

const Navrent = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState("Fetching location...");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          )
            .then((response) => response.json())
            .then((data) => setLocation(data.display_name || "Location not found"))
            .catch(() => setLocation("Unable to retrieve location"));
        },
        () => setLocation("Permission denied for location access")
      );
    } else {
      setLocation("Geolocation is not supported by this browser");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav style={styles.navbar}>
      {/* Logo */}
      <div style={styles.logoContainer}>
        <img
          src="https://static.vecteezy.com/system/resources/previews/000/623/239/original/auto-car-logo-template-vector-icon.jpg"
          alt="Car Logo"
          style={styles.logo}
        />
      </div>
      <h2 style={styles.brandName}>Car Marketplace</h2>


      {/* Navigation Links */}
      <ul style={styles.navLinks}>
      <li><Link to="/maindashboard" style={styles.navLink}>Home</Link></li>

      <li><Link to="/rendcardashboard" style={styles.navLink}>Back</Link></li>

        <li><Link to="/userdetails" style={styles.navLink}>User Details</Link></li>
        <li><Link to="/Complaint" style={styles.navLink}>Complaint</Link></li>
        <li><Link to="/Orderstatus" style={styles.navLink}>My Booking</Link></li>
        <li><Link to="/FAQSection" style={styles.navLink}>FAQ Section</Link></li>
      </ul>

      {/* Location & Logout */}
      <div style={styles.rightContainer}>
        <div style={styles.locationContainer}>
          <FaMapMarkerAlt style={styles.locationIcon} />
          <span style={styles.locationText}>{location}</span>
        </div>
        {localStorage.getItem("token") && (
          <button style={styles.logoutButton} onClick={handleLogout}>Logout</button>
        )}
      </div>
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
  logoContainer: {
    display: "flex",
    alignItems: "center",
  },
  logo: {
    width: "40px",
    height: "40px",
    marginRight: "10px",
  },
  brandName: {
    color: "white",
    fontSize: "22px",
    fontWeight: "bold",
  },
  navLinks: {
    listStyleType: "none",
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  navLink: {
    color: "white",
    textDecoration: "none",
    fontSize: "16px",
    padding: "8px 12px",
    borderRadius: "5px",
    transition: "background-color 0.3s ease",
    fontWeight: "500",
  },
  rightContainer: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  locationContainer: {
    display: "flex",
    alignItems: "center",
    color: "white",
    fontSize: "14px",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: "8px",
    borderRadius: "5px",
    maxWidth: "300px", // Adjust width to allow longer text
    wordWrap: "break-word", // Ensures text wraps properly
  },
  locationIcon: {
    marginRight: "5px",
    color: "red",
    fontSize: "16px",
  },
  locationText: {
    whiteSpace: "normal", // Allows multi-line text
    wordBreak: "break-word", // Ensures long words wrap
  },
  logoutButton: {
    backgroundColor: "#d9534f",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
};

export default Navrent;
