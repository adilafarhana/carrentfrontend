import React from "react";
import { Link } from "react-router-dom";

const Navrent = () => {
  const navbarStyle = {
    backgroundColor: "#333",
    padding: "10px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between", // Distribute space between nav items and image
  };

  const ulStyle = {
    listStyleType: "none",
    margin: 0,
    padding: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
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
  };

  const logoStyle = {
    width: "40px",  // Adjust the size of the logo
    height: "auto",
    marginRight: "20px", // Add some space between the logo and nav items
  };

  return (
    <nav style={navbarStyle}>
      {/* Logo */}
      <img src="https://static.vecteezy.com/system/resources/previews/000/623/239/original/auto-car-logo-template-vector-icon.jpg" alt="Car Logo" style={logoStyle} width={100} height={100}
      />

      {/* Nav Links */}
      <ul style={ulStyle}>
        <li style={liStyle}>
          <Link
            to="/rendcar"
            style={linkStyle}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#575757")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "transparent")}
          >
            Rent Car
          </Link>
        </li>
        <li style={liStyle}>
          <Link
            to="/usedcar"
            style={linkStyle}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#575757")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "transparent")}
          >
            Used Car
          </Link>
          <Link
            to="/signin"
            style={linkStyle}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#575757")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "transparent")}
          >
            Reviews
          </Link>
          <Link
            to="/signin"
            style={linkStyle}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#575757")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "transparent")}
          >
            offers
          </Link>
          <Link
            to="/Userrentblogs"
            style={linkStyle}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#575757")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "transparent")}
          >
            blogs
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navrent;
