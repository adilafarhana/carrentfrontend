import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navadmindashboard = () => {
  const navigate = useNavigate(); // Use navigate for redirection

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token
    navigate("/"); // Redirect to home page
  };

  const navbarStyle = {
    backgroundColor: "#333",
    padding: "10px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    zIndex: 1000,
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
    width: "120px",
    height: "auto",
  };

  return (
    <nav style={navbarStyle}>
      {/* Logo on the left */}
      <img
        src="https://static.vecteezy.com/system/resources/previews/000/623/239/original/auto-car-logo-template-vector-icon.jpg"
        alt="Car Logo"
        style={logoStyle}
      />
      <Link
                  to="/uploadcar"
                  style={linkStyle}
                  onMouseOver={(e) => (e.target.style.backgroundColor = "#575757")}
                  onMouseOut={(e) => (e.target.style.backgroundColor = "transparent")}
                >
      Upload cars       </Link>
      

      {/* Logout button aligned to the right */}
      <ul style={{ ...ulStyle, marginLeft: "auto" }}>
        {localStorage.getItem("token") ? (
          <li style={liStyle}>
            <span
              style={linkStyle}
              onClick={handleLogout} // Call handleLogout on click
              onMouseOver={(e) => (e.target.style.backgroundColor = "#575757")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "transparent")}
            >
              Logout
            </span>
          </li>
        ) : null}
      </ul>
        <Link
                  to="/viewusers"
                  style={linkStyle}
                  onMouseOver={(e) => (e.target.style.backgroundColor = "#575757")}
                  onMouseOut={(e) => (e.target.style.backgroundColor = "transparent")}
                >
                  Used Car
                </Link>
    </nav>
  );
};

export default Navadmindashboard;
