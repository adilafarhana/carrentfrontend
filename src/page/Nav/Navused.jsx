import React from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { FaMapMarkerAlt } from "react-icons/fa"; // Import location icon
import  { useState, useEffect } from "react";

const Navused = () => {
  const navigate = useNavigate(); // Initialize useNavigate
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
    localStorage.removeItem("token"); // Remove token
    navigate("/"); // Redirect to home page
  };

  const navbarStyle = {
    backgroundColor: "#333",
    padding: "100",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",

  };

  const ulStyle = {
    listStyleType: "none",
    margin: 0,
    padding: 0,
    display: "flex",
    alignItems: "center",
  };

  const liStyle = {
    margin: "0 15px",
  };

  const linkStyle = {
    color: "white",
    textDecoration: "none",
    fontSize: "18px",
    padding: "10px 15px",
    borderRadius: "5px",
    transition: "background-color 0.3s ease",
    cursor: "pointer",
  };

  const logoStyle = {
    width: "40px",
    height: "auto",
    marginRight: "20px",
  };

  return (
    <nav style={navbarStyle}>
      {/* Logo */}
      <img
        src="https://static.vecteezy.com/system/resources/previews/000/623/239/original/auto-car-logo-template-vector-icon.jpg"
        alt="Car Logo"
        style={logoStyle}
        width={100}
        height={100}
      />
      <h2 style={styles.brandName}>Car Marketplace</h2>

      {/* Nav Links */}
      <ul style={ulStyle}>


        <li style={liStyle}>
          <Link
            to="/FAQSection"
            style={linkStyle}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#575757")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "transparent")}
          >
            View FAQ
          </Link>
        </li>
        <li style={liStyle}>
          <Link
            to="/Complaint"
            style={linkStyle}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#575757")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "transparent")}
          >
            Complaint          </Link>
        </li>
       
        <li style={liStyle}>
          <Link
            to="/userdetails"
            style={linkStyle}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#575757")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "transparent")}
          >
            userdetails
          </Link>
        </li>
      </ul>  <Link
        to="/bloglist"
        style={linkStyle}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#575757")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "transparent")}
      >
        bloglist          </Link>

      <Link
        to="/Orderstatus"
        style={linkStyle}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#575757")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "transparent")}
      >
        My booking
      </Link>

      {/* Logout Button */}
      {localStorage.getItem("token") && (
        <ul style={{ ...ulStyle, marginLeft: "auto" }}>
          <li style={liStyle}>
            <span
              style={linkStyle}
              onClick={handleLogout}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#575757")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "transparent")}
            >
              Logout
            </span>
          </li>
        </ul>

      )}
       {/* Location & Logout */}
            <div style={styles.rightContainer}>
              <div style={styles.locationContainer}>
                <FaMapMarkerAlt style={styles.locationIcon} />
                <span style={styles.locationText}>{location}</span>
              </div>
             
            </div>
    </nav>
  );
};
const styles = {



  brandName: {
    color: "white",
    fontSize: "22px",
    fontWeight: "bold",
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




};
export default Navused;