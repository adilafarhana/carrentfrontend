import React from "react";
import { Link } from "react-router-dom";

const NavHome= () => {
  const navbarStyle = {
    backgroundColor: "#333",
    padding: "10px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between", // **Changed**: Logo on the left, center nav items
  };

  const ulStyle = {
    listStyleType: "none",
    margin: 0,
    padding: 0,
    display: "flex",
    justifyContent: "center", // **Changed**: Center items horizontally
    alignItems: "center",
    width: "100%", // Ensure it takes full width
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
    width: "120px",  // Set logo width to make it large
    height: "auto",
  };

  return (
    <nav style={navbarStyle}>
      {/* **Logo placed here to be on the left side** */}
      <img 
        src="https://static.vecteezy.com/system/resources/previews/000/623/239/original/auto-car-logo-template-vector-icon.jpg" 
        alt="Car Logo" 
        style={logoStyle} 
      />
      
      {/* Nav Links */}
      <ul style={ulStyle}>
        <li style={liStyle}>
          <Link
            to="/rendcardashboard"
            style={linkStyle}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#575757")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "transparent")}
          >
             Used Car
            
          </Link>
        </li>
        <li style={liStyle}>
          <Link
            to="/usedcardashboard"
            style={linkStyle}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#575757")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "transparent")}
          >
            Rent Car
          </Link>
          <Link
            to="/userdetails"
            style={linkStyle}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#575757")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "transparent")}
          >
           Userdetails 
          </Link>

          <Link
            to="/blogupload"
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

export default NavHome;
