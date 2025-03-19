import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Navused from "../Nav/Navused";

const Rendcardashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { brand, model, price, description, type, images } = location.state || {};

  const [cars, setCars] = useState([]);

  useEffect(() => {
    axios.post("https://carrentbackend-1-tpmm.onrender.com//cars", { type: "Used" })
      .then((response) => {
        setCars(response.data);

        // Fetch notifications and alert the user
        axios.get("https://carrentbackend-1-tpmm.onrender.com//getnotication", requestHeader).then((notificationResponse) => {
          if (notificationResponse?.data) {
            alert(notificationResponse.data.map(notification => notification.message).join('\n'));
          }
        });
      })
      .catch((error) => {
        console.error("Error fetching car details:", error);
      });
  }, []);
  
  return (
    <>
      <Navused />
      <header className="bg-primary text-white text-center py-5">
        <h1>Welcome to Our Used car Platform</h1>
        <p>Your one-stop shop for hassle-free used car rentals, sales, and more!</p>
      </header>

      {/* Image Carousel */}
      <div id="carouselExampleIndicators" className="carousel slide">
        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="0"
            className="active"
            aria-current="true"
            aria-label="Slide 1"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="1"
            aria-label="Slide 2"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="2"
            aria-label="Slide 3"
          ></button>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img
              src="https://www.progressivetourtravels.com/images/car-banner.jpg"
              className="d-block w-100"
              alt="..."
            />
          </div>
          <div className="carousel-item">
            <img
              src="https://www.progressivetourtravels.com/images/car-banner.jpg"
              className="d-block w-100"
              alt="..."
            />
          </div>
          <div className="carousel-item">
            <img
              src="https://www.progressivetourtravels.com/images/car-banner.jpg "
              className="d-block w-100"
              alt="..."
            />
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
      <div className="container my-5">
        <h2 className="text-center mb-4">Popular Car Brands</h2>
        <div className="row text-center">
          {[
            { name: "volkswagen", img: "https://www.carlogos.org/car-logos/volkswagen-logo.png" },
            { name: "hyundai", img: "https://www.carlogos.org/car-logos/hyundai-logo.png" },
            { name: "Ford", img: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Ford_logo_flat.svg" },
            { name: "BMW", img: "https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg" },
            { name: "benz", img: "https://www.carlogos.org/car-logos/mercedes-benz-logo.png" },
            { name: "KIA", img: "https://www.carlogos.org/car-logos/kia-logo.png" }
          ].map((brand, index) => (
            <div key={index} className="col-md-2 mb-3">
              <div className="card p-3">
                <img src={brand.img} alt={brand.name} className="card-img-top" style={{ height: "100px", objectFit: "contain" }} />
                <div className="card-body">
                  <h6 className="card-title">{brand.name}</h6>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Car Listings Section */}
      <section id="carListings" className="container mt-5">
        <h2 className="text-center mb-4">Cars</h2>
        <div className="row">
          {cars.length > 0 ? (
            cars.map((car) => (
              <div key={car._id} className="col-md-4 mb-4">
                <div className="card">
                  {car.images.length > 0 && (
                    <img src={`https://carrentbackend-1-tpmm.onrender.com/${car.images[0]}`} alt={car.model} className="card-img-top" />
                  )}
                  <div className="card-body">
                    <h5>{car.brand} {car.model}</h5>
                    <p><del style={{ color: 'red', fontSize: '1.1em' }}>MRP: ₹{(car.price / (1 - car.discountPercentage / 100)).toFixed(2)}</del></p>
                    <p style={{ color: 'green', fontSize: '1.1em' }}>
                      <strong>Discounted Price: ₹{car.price}</strong> ({car.discountPercentage}% OFF)
                    </p>
                    {car.specialOffers && <p className="offer" style={{ fontSize: '1.2em', color: '#ff4500' }}>🔥 {car.specialOffers}</p>}
                    <p><strong>Price:</strong> ₹{car.price}</p>
                    <p><strong>Status:</strong> {car.status}</p>

                    <button onClick={() => navigate(`/car-details/${car?._id}`, { state: { id: car?._id } })} className="btn btn-secondary">
                      Booking Now
                    </button>
                    <br /><br />
                    {car.status === "Available" ? (
                      <button className="btn btn-primary">
                        <Link to={`/car-reviews/${car._id}`} style={{ textDecoration: "none", color: "inherit" }}>
                          View Review
                        </Link>
                      </button>
                    ) : (
                      <button disabled className="btn btn-secondary" style={{ cursor: "not-allowed" }}>
                        Not Available
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No cars available.</p>
          )}
        </div>
        <footer
        style={{
          backgroundColor: "#000000", // Black background
          color: "#ffffff", // White text
          padding: "40px 20px",
          marginTop: "40px",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: "20px",
          }}
        >
          <div style={{ flex: "1", minWidth: "200px" }}>
            <h4 style={{ marginBottom: "15px" }}>About Us</h4>
            <p>We are the leading online vehicle marketplace offering car sales, rentals, and best-in-class customer support.</p>
          </div>
          <div style={{ flex: "1", minWidth: "200px" }}>
            <h4 style={{ marginBottom: "15px" }}>Contact</h4>
            <p>Email: support@car-marketplace.com</p>
            <p>Phone: +91 98765 43210</p>
            <p>Location: Ernakulam, India</p>
          </div>
          <div style={{ flex: "1", minWidth: "200px" }}>
            <h4 style={{ marginBottom: "15px" }}>Rent a Car</h4>
            <p>Choose from a wide range of cars for rent, from economy to luxury.</p>
          </div>
          <div style={{ flex: "1", minWidth: "200px" }}>
            <h4 style={{ marginBottom: "15px" }}>Used Cars</h4>
            <p>Browse our collection of quality pre-owned cars at unbeatable prices.</p>
          </div>
        </div>
        <div
          style={{
            textAlign: "center",
            marginTop: "20px",
            paddingTop: "20px",
            borderTop: "1px solid #444",
          }}
        >
          &copy; 2025 Car Marketplace | All rights reserved.
        </div>
      </footer>
      </section>
    </>
  );
};

export default Rendcardashboard;
