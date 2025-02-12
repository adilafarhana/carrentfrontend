import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navrent from "./Navrent";

// Sample car images (replace with dynamic images as needed)
const carImages = [
  "https://imgd.aeplcdn.com/300x225/vimages/202502/3826557_150913_1_1738847942911.jpg?q=80",
  "https://imgd.aeplcdn.com/300x225/vimages/202501/3813234_150913_1_1738163524911.jpg?q=80",
  "https://imgd.aeplcdn.com/300x225/vimages/202502/3826512_150913_1_1738847525619.jpg?q=80",
  "https://imgd.aeplcdn.com/300x225/vimages/202502/3826512_150913_1_1738847525619.jpg?q=80",
  "https://imgd.aeplcdn.com/300x225/vimages/202502/3826512_150913_1_1738847525619.jpg?q=80",
  "https://imgd.aeplcdn.com/300x225/vimages/202502/3826512_150913_1_1738847525619.jpg?q=80"
];

const Rendcardashboard = () => {
  // Get car data from the location state passed during navigation
  const location = useLocation();
  const { brand, model, price, description, type, images } = location.state || {};

  const [cars, setCars] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3030/cars")
      .then((response) => response.json())
      .then((data) => setCars(data))
      .catch((error) => console.error("Error fetching car details:", error));
  }, []);

  return (
    <>
      {/* Navigation Component */}
      <Navrent />
      <header className="bg-primary text-white text-center py-5">
        <h1>Welcome to Our Car Rental Platform</h1>
        <p>Your one-stop shop for hassle-free car rentals, sales, and more!</p>
      </header>
      {/* Carousel Section */}
      <section id="carouselSection" className="carousel-section mt-4">
        <div id="carouselExample" className="carousel slide">
          <div className="carousel-inner">
            {/* Dynamically map images if provided, otherwise fallback to placeholders */}
            {(images && images.length > 0) ? (
              images.map((image, index) => (
                <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                  <img src={image} className="d-block w-100" alt={`Car ${index + 1}`} />
                </div>
              ))
            ) : (
              <>
                <div className="carousel-item active">
                  <img src="https://cdn.wallpapersafari.com/11/41/0Xo4mS.jpg" className="d-block w-100" alt="Car 1" />
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
        <p><strong>Price:</strong> ₹{price}</p>
        <p><strong>Type:</strong> {type}</p>
      </section>

      {/* Other Cars Section (displaying additional cars) */}
      <section id="carListings" className="container mt-5">
        <h2 className="text-center mb-4">Other Cars</h2>
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
                    <p><strong>Price:</strong> ₹{car.price}</p>
                    <p><strong>Type:</strong> {car.type}</p>
                    <a href={`https://wa.me/?text=Interested%20in%20${car.brand}%20${car.model}`} target="_blank" className="btn btn-primary" style={{ display: "flex", alignItems: "center" }}>
                      <img src="https://tse3.mm.bing.net/th?id=OIP.fEum36tZP-1rdo6gJwu61gHaHa&pid=Api&P=0&h=180" alt="WhatsApp" style={{ width: '30px', height: '30px', marginRight: '8px' }} />
                      WhatsApp
                    </a>
                    <br />
                    <a href="tel:+1234567890" className="btn btn-primary" style={{ display: "flex", alignItems: "center" }}>
                      <img src="https://tse1.mm.bing.net/th?id=OIP.7Av_nF2IfD_8Rt7NnflBGgAAAA&pid=Api&P=0&h=180" alt="Call" style={{ width: '30px', height: '30px', marginRight: '8px' }} />
                      Call
                    </a>
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
