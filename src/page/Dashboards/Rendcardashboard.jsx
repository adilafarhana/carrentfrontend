import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios"; 
import Navrent from "../Nav/Navrent";

const Rendcardashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { brand, model, price, description, type, images } = location.state || {};

  const [cars, setCars] = useState([]);

  useEffect(() => {
    axios.post("http://localhost:3030/cars", { type: "Used" }) // Using Axios
      .then((response) => {
        setCars(response.data);
      })
      .catch((error) => {
        console.error("Error fetching car details:", error);
      });
  }, []);

  return (
    <>
      <Navrent />
      <header className="bg-primary text-white text-center py-5">
        <h1>Welcome to Our Car Rental Platform</h1>
        <p>Your one-stop shop for hassle-free car rentals, sales, and more!</p>
      </header>

      {/* Carousel Section */}
      <section id="carouselSection" className="carousel-section mt-4">
        <div id="carouselExample" className="carousel slide">
          <div className="carousel-inner">
            {images && images.length > 0 ? (
              images.map((image, index) => (
                <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                  <img src={image} className="d-block w-100" alt={`Car ${index + 1}`} />
                </div>
              ))
            ) : (
              <>
                <div className="carousel-item active">
                  <img src="https://www.traveltoindia.org/images/car-rental_bnr-1.jpg" className="d-block w-100" alt="Car 1" />
                </div>
                <div className="carousel-item">
                  <img src="https://cdn.wallpapersafari.com/11/41/0Xo4mS.jpg" className="d-block w-100" alt="Car 2" />
                </div>
                <div className="carousel-item">
                  <img src="https://cdn.wallpapersafari.com/46/93/iNy7Ko.jpg" className="d-block w-100" alt="Car 3" />
                </div>
              </>
            )}
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </section>

      {/* Car Details Section */}
      <section id="carDetails" className="container mt-5">
        <h2>{brand} {model}</h2>
        <p>{description}</p>
      </section>

      {/* Other Cars Section */}
      <section id="carListings" className="container mt-5">
        <h2 className="text-center mb-4">Cars</h2>
        <div className="row">
          {cars.length > 0 ? (
            cars.map((car) => (
              <div key={car._id} className="col-md-4 mb-4">
                <div className="card">
                  {car.images.length > 0 && (
                    <img src={`http://localhost:3030${car.images[0]}`} alt={car.model} className="card-img-top" />
                  )}
                  <div className="card-body">
                    <h5>{car.brand} {car.model}</h5>
                    <p>{car.description}</p>
                    <p><del>MRP: ₹{(car.price / (1 - car.discountPercentage / 100)).toFixed(2)}</del></p>
            <p><strong>Discounted Price: ₹{car.price}</strong> ({car.discountPercentage}% OFF)</p>
            {car.specialOffers && <p className="offer">🔥 {car.specialOffers}</p>}
                    <p><strong>Price:</strong> ₹{car.price}</p>
                    
                    <a href={`https://wa.me/?text=Interested%20in%20${car.brand}%20${car.model}`} target="_blank" className="btn btn-primary" style={{ display: "flex", alignItems: "center" }}>
                      <img src="https://tse3.mm.bing.net/th?id=OIP.fEum36tZP-1rdo6gJwu61gHaHa&pid=Api&P=0&h=180" alt="WhatsApp" style={{ width: '30px', height: '30px', marginRight: '8px' }} />
                      WhatsApp
                    </a>
                    <br />
                    <a href="tel:+1234567890" className="btn btn-primary" style={{ display: "flex", alignItems: "center" }}>
                      <img src="https://tse1.mm.bing.net/th?id=OIP.7Av_nF2IfD_8Rt7NnflBGgAAAA&pid=Api&P=0&h=180" alt="Call" style={{ width: '30px', height: '30px', marginRight: '8px' }} />
                      Call
                    </a>
                    <br></br>
                    <button
                      onClick={() => navigate(`/car-details/${car?._id }`, { state: { id:car?._id } })}
                      className="btn btn-secondary"
                      style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                    >
                      Booking Now
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No cars available.</p>
          )}
        </div>
      </section>
    </>
  );
};

export default Rendcardashboard;
