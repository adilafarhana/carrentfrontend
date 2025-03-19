import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link
import Navrent from "../Nav/Navrent";
import axios from "axios";

const Usedcardashboard = () => {
  const [rentCars, setRentCars] = useState([]);

  useEffect(() => {
    axios
      .post("https://carrentbackend-1-tpmm.onrender.com/cars", { type: "Rent" })
      .then((response) => {
        setRentCars(response.data);
      })
      .catch((error) => {
        console.error("Error fetching car details:", error);
      });
  }, []);
  const fetchRentalCars = async () => {
    try {
      const response = await axios.get("https://carrentbackend-1-tpmm.onrender.com/getcars", requestHeader);
      const rentalCars = response.data.filter(car => car.type === "Rent");
      setCars(rentalCars);
    } catch (error) {
      console.error("Error fetching rental cars:", error);
    }
  };
  
  useEffect(() => {
    fetchRentalCars();
  }, []);
  
  return (
    <>
      <Navrent />

      <header className="bg-primary text-white text-center py-5">
      <h1>Welcome to Our Rent car Platform</h1>
      <p>Find the best rental deals tailored to your needs!</p>
      </header>

      {/* Image Carousel */}
      <div id="carouselExampleIndicators" className="carousel slide">
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src="https://cdn.wallpapersafari.com/11/41/0Xo4mS.jpg" className="d-block w-100" alt="Slide 1" />
          </div>
          <div className="carousel-item">
            <img src="https://cdn.wallpapersafari.com/11/41/0Xo4mS.jpg" className="d-block w-100" alt="Slide 2" />
          </div>
          <div className="carousel-item">
            <img src="https://cdn.wallpapersafari.com/11/41/0Xo4mS.jpg" className="d-block w-100" alt="Slide 3" />
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      {/* Car Brand Logos */}
      <div className="container my-5">
        <h2 className="text-center mb-4">Our Car Rental Brands</h2>
        <div id="brandCarousel" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner text-center">
            <div className="carousel-item active">
              <div className="d-flex justify-content-center">
                {["lamborghini", "rolls-royce", "mercedes-benz", "tesla", "toyota"].map((brand) => (
                  <img key={brand} src={`https://www.carlogos.org/car-logos/${brand}-logo.png`} className="brand-logo img-fluid mx-3" alt={brand} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Car Listings Section */}
      <section id="carListings" className="container mt-5">
        <h2 className="text-center mb-4">Rental Cars</h2>
        <div className="row">
          {rentCars.length > 0 ? (
            rentCars.map((car) => (
              <div key={car._id} className="col-md-4 mb-4">
                <div className="card">
                  {/* Conditionally render the Link only if the car is Available */}
                  {car.status === "Available" ? (
                    <Link to={`/car-details/${car._id}`} state={{ id: car._id }}>
                      {car.images?.length > 0 && (
                        <img src={`https://carrentbackend-1-tpmm.onrender.com/${car.images[0]}`} alt={car.model} className="card-img-top" />
                      )}
                    </Link>
                  ) : (
                    car.images?.length > 0 && (
                      <img src={`https://carrentbackend-1-tpmm.onrender.com/${car.images[0]}`} alt={car.model} className="card-img-top" style={{ opacity: 0.6 }} />
                    )
                  )}

                  <div className="card-body">
                    <h5>{car.brand}</h5>
                    <h5>{car.model}</h5>

                    <p><strong>Status:</strong> {car.status}</p>

                    {/* Conditionally disable the review button if the car is not available */}
                    {car.status === "Available" ? (
                      <Link to={`/car-reviews/${car._id}`} className="btn btn-primary">View Review</Link>
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
            <p className="text-center">No rental cars available.</p>
          )}
        </div> <footer
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

export default Usedcardashboard;