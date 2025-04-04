import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";
import styled from "styled-components";

const NavbarContainer = styled.nav`
  background-color: #333;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  position: relative;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 1rem;
  }
`;

const BrandContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 2rem;

  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 1rem;
  }
`;

const Logo = styled.img`
  width: 40px;
  height: 40px;
  margin-right: 15px;
  border-radius: 50%;
`;

const BrandName = styled.h2`
  color: white;
  font-size: 1.4rem;
  font-weight: bold;
  margin: 0;
`;

const NavLinks = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  flex-grow: 1;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    margin-bottom: 1rem;
  }
`;

const NavItem = styled.li`
  margin: 0 0.5rem;

  @media (max-width: 768px) {
    margin: 0.5rem 0;
    width: 100%;
    text-align: center;
  }
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  transition: background-color 0.3s ease;
  display: inline-block;

  &:hover {
    background-color: #575757;
  }

  @media (max-width: 768px) {
    display: block;
    width: 100%;
  }
`;

const LogoutButton = styled.span`
  color: white;
  text-decoration: none;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  transition: background-color 0.3s ease;
  cursor: pointer;
  display: inline-block;

  &:hover {
    background-color: #575757;
  }

  @media (max-width: 768px) {
    display: block;
    width: 100%;
    text-align: center;
  }
`;

const RightContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;

  @media (max-width: 768px) {
    margin-left: 0;
    width: 100%;
    justify-content: center;
  }
`;

const LocationContainer = styled.div`
  display: flex;
  align-items: center;
  color: white;
  font-size: 0.875rem;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 0.5rem;
  border-radius: 5px;
  max-width: 250px;
  word-wrap: break-word;
  margin-right: 1rem;

  @media (max-width: 768px) {
    max-width: 100%;
    margin-right: 0;
    margin-bottom: 1rem;
  }
`;

const LocationIcon = styled(FaMapMarkerAlt)`
  margin-right: 0.5rem;
  color: red;
  font-size: 1rem;
  flex-shrink: 0;
`;

const Navused = () => {
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
      setLocation("Geolocation not supported");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <NavbarContainer>
      <BrandContainer>
        <Logo
          src="https://static.vecteezy.com/system/resources/previews/000/623/239/original/auto-car-logo-template-vector-icon.jpg"
          alt="Car Logo"
        />
        <BrandName>Car Marketplace</BrandName>
      </BrandContainer>

      <NavLinks>
      <NavItem>
          <NavLink to="/maindashboard">Home</NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/FAQSection">View FAQ</NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/Complaint">Complaint</NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/userdetails">User Details</NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/bloglist">Blog List</NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/Orderstatus">My Booking</NavLink>
        </NavItem>
      </NavLinks>

      <RightContainer>
        <LocationContainer>
          <LocationIcon />
          <span>{location}</span>
        </LocationContainer>

        {localStorage.getItem("token") && (
          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        )}
      </RightContainer>
    </NavbarContainer>
  );
};

export default Navused;