import React from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate

const Navrent = () => {
  const navigate = useNavigate(); // Initialize useNavigate

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

      {/* Nav Links */}
      <ul style={ulStyle}>
        <li style={liStyle}>
        
        </li>
        <li style={liStyle}>
        
        </li>
        <li style={liStyle}>
          <Link
            to="/Carreviews"
            style={linkStyle}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#575757")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "transparent")}
          >
            Reviews
          </Link>
        </li>
        <li style={liStyle}>
        </li>
        <li style={liStyle}>
          <Link
            to="/blogupload"
            style={linkStyle}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#575757")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "transparent")}
          >
            Blogs
          </Link>
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
            Orderstatus
          </Link>
<Link
            to="/usedcardashboard"
            style={linkStyle}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#575757")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "transparent")}
          >
usedcar        </Link>

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
    </nav>
  );
};

export default Navrent;
