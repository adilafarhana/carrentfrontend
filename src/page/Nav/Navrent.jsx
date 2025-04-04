import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaBars, FaTimes } from "react-icons/fa";
import { MdDirectionsCar } from "react-icons/md";

const Navrent = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState("Getting location...");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
              );
              const data = await response.json();
              setLocation(data.display_name || "Location found");
              setIsLoadingLocation(false);
            },
            () => {
              setLocation("Enable location access");
              setIsLoadingLocation(false);
            }
          );
        } else {
          setLocation("Location unavailable");
          setIsLoadingLocation(false);
        }
      } catch (error) {
        setLocation("Error getting location");
        setIsLoadingLocation(false);
      }
    };

    fetchLocation();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        {/* Brand Logo and Name */}
        <div style={styles.brandContainer}>
          <MdDirectionsCar style={styles.logoIcon} />
          <h1 style={styles.brandName}>Car Marketplace</h1>
        </div>

        {/* Desktop Navigation */}
        <nav style={styles.desktopNav}>
          <ul style={styles.navList}>
            <li style={styles.navItem}>
              <Link to="/maindashboard" style={styles.navLink}>Home</Link>
            </li>
            <li style={styles.navItem}>
              <Link to="/rendcardashboard" style={styles.navLink}>Back</Link>
            </li>
            <li style={styles.navItem}>
              <Link to="/userdetails" style={styles.navLink}>Profile</Link>
            </li>
            <li style={styles.navItem}>
              <Link to="/Complaint" style={styles.navLink}>Complaints</Link>
            </li>
            <li style={styles.navItem}>
              <Link to="/Orderstatus" style={styles.navLink}>My Bookings</Link>
            </li>
            <li style={styles.navItem}>
              <Link to="/FAQSection" style={styles.navLink}>FAQs</Link>
            </li>
          </ul>
        </nav>

        {/* Right Side Content */}
        <div style={styles.rightContent}>
          <div style={styles.locationContainer}>
            <FaMapMarkerAlt style={styles.locationIcon} />
            <span style={styles.locationText}>
              {isLoadingLocation ? "Locating..." : location.length > 30 
                ? `${location.substring(0, 30)}...` 
                : location}
            </span>
          </div>
          
          {localStorage.getItem("token") && (
            <button style={styles.logoutButton} onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          style={styles.mobileMenuButton} 
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <nav style={styles.mobileNav}>
          <ul style={styles.mobileNavList}>
            <li style={styles.mobileNavItem}>
              <Link to="/maindashboard" style={styles.mobileNavLink} onClick={toggleMobileMenu}>Home</Link>
            </li>
            <li style={styles.mobileNavItem}>
              <Link to="/rendcardashboard" style={styles.mobileNavLink} onClick={toggleMobileMenu}>Back</Link>
            </li>
            <li style={styles.mobileNavItem}>
              <Link to="/userdetails" style={styles.mobileNavLink} onClick={toggleMobileMenu}>Profile</Link>
            </li>
            <li style={styles.mobileNavItem}>
              <Link to="/Complaint" style={styles.mobileNavLink} onClick={toggleMobileMenu}>Complaints</Link>
            </li>
            <li style={styles.mobileNavItem}>
              <Link to="/Orderstatus" style={styles.mobileNavLink} onClick={toggleMobileMenu}>My Bookings</Link>
            </li>
            <li style={styles.mobileNavItem}>
              <Link to="/FAQSection" style={styles.mobileNavLink} onClick={toggleMobileMenu}>FAQs</Link>
            </li>
            <li style={styles.mobileNavItem}>
              <button 
                style={styles.mobileLogoutButton} 
                onClick={() => {
                  handleLogout();
                  toggleMobileMenu();
                }}
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};

// Standardized Styles
const styles = {
  header: {
    backgroundColor: "#1a1a2e",
    color: "#ffffff",
    padding: "1rem 0",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 1.5rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
  },
  brandContainer: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  logoIcon: {
    fontSize: "2rem",
    color: "#4cc9f0",
  },
  brandName: {
    fontSize: "1.5rem",
    fontWeight: "600",
    margin: 0,
    background: "linear-gradient(90deg, #4cc9f0, #4895ef)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  desktopNav: {
    display: "flex",
    alignItems: "center",
    '@media (max-width: 768px)': {
      display: "none",
    },
  },
  navList: {
    display: "flex",
    listStyle: "none",
    margin: 0,
    padding: 0,
    gap: "1.5rem",
  },
  navItem: {
    position: "relative",
  },
  navLink: {
    color: "#ffffff",
    textDecoration: "none",
    fontSize: "1rem",
    fontWeight: "500",
    padding: "0.5rem 0",
    transition: "color 0.3s ease",
    position: "relative",
    '&:hover': {
      color: "#4cc9f0",
    },
    '&::after': {
      content: '""',
      position: "absolute",
      bottom: 0,
      left: 0,
      width: "0%",
      height: "2px",
      backgroundColor: "#4cc9f0",
      transition: "width 0.3s ease",
    },
    '&:hover::after': {
      width: "100%",
    },
  },
  rightContent: {
    display: "flex",
    alignItems: "center",
    gap: "1.5rem",
    '@media (max-width: 768px)': {
      display: "none",
    },
  },
  locationContainer: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: "0.5rem 1rem",
    borderRadius: "50px",
    maxWidth: "200px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  locationIcon: {
    color: "#f72585",
    fontSize: "1rem",
    flexShrink: 0,
  },
  locationText: {
    fontSize: "0.875rem",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  logoutButton: {
    backgroundColor: "transparent",
    color: "#ffffff",
    border: "1px solid #f72585",
    padding: "0.5rem 1.25rem",
    borderRadius: "50px",
    cursor: "pointer",
    fontSize: "0.875rem",
    fontWeight: "500",
    transition: "all 0.3s ease",
    '&:hover': {
      backgroundColor: "#f72585",
    },
  },
  mobileMenuButton: {
    display: "none",
    backgroundColor: "transparent",
    border: "none",
    color: "#ffffff",
    fontSize: "1.5rem",
    cursor: "pointer",
    '@media (max-width: 768px)': {
      display: "block",
    },
  },
  mobileNav: {
    display: "none",
    width: "100%",
    backgroundColor: "#16213e",
    '@media (max-width: 768px)': {
      display: "block",
    },
  },
  mobileNavList: {
    listStyle: "none",
    margin: 0,
    padding: "1rem 0",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  mobileNavItem: {
    padding: "0 1.5rem",
  },
  mobileNavLink: {
    display: "block",
    color: "#ffffff",
    textDecoration: "none",
    padding: "0.75rem 0",
    fontSize: "1rem",
    fontWeight: "500",
    transition: "color 0.3s ease",
    '&:hover': {
      color: "#4cc9f0",
    },
  },
  mobileLogoutButton: {
    width: "100%",
    textAlign: "left",
    backgroundColor: "transparent",
    color: "#ffffff",
    border: "none",
    padding: "0.75rem 0",
    fontSize: "1rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "color 0.3s ease",
    '&:hover': {
      color: "#f72585",
    },
  },
  '@media (max-width: 768px)': {
    brandName: {
      fontSize: "1.25rem",
    },
    navList: {
      gap: "1rem",
    },
    navLink: {
      fontSize: "0.875rem",
    },
    locationContainer: {
      maxWidth: "150px",
      padding: "0.5rem",
    },
    locationText: {
      fontSize: "0.75rem",
    },
  },
};

export default Navrent;